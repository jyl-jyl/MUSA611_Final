const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const Joi = require('joi');
const { campgroundSchema, reviewSchema } = require('../schema.js');
const { storage, cloudinary } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAP_BOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
}



router.get('/',  catchAsync(async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/index', { campgrounds });

}))

router.get('/new', (req, res) => {
	res.render('campgrounds/new');
})

router.post('/', upload.array('image'), validateCampground, catchAsync(async (req, res, next) => {

    const geoData = await geocoder.forwardGeocode({
    	query: req.body.campground.location,
    	limit: 1,
    }).send();
	const campground = new Campground(req.body.campground);
	campground.geometry = geoData.body.features[0].geometry;
	campground.image = req.files.map(f => ({ url: f.path, filename: f.filename }));

	await campground.save();
	console.log(campground);
	req.flash('success', 'Successfully made a new campground!');
	res.redirect(`/campgrounds/${campground._id}`);

}))



router.get('/:id', catchAsync(async  (req, res) => {
	const campground = await Campground.findById(req.params.id).populate('reviews');
	if (!campground) {
		req.flash('error', 'Cannot found that campground!');
		return res.redirect('/campgrounds');
	}
	res.render('campgrounds/show', { campground });
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	if (!campground) {
		req.flash('error', 'Cannot found that campground!');
		return res.redirect('/campgrounds');
	}
	res.render('campgrounds/edit', { campground });
}))

router.put('/:id', upload.array('image'), validateCampground, catchAsync(async(req, res) => {
	const { id } = req.params;
	const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground});
	const img = req.files.map(f => ({ url: f.path, filename: f.filename }));
	await campground.image.push(...img);
	await campground.save();
    if (req.body.deleteImage) {
    	for (let filename of req.body.deleteImage) {
    		await cloudinary.uploader.destroy(filename);
    	}
    	await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImage }}}});
    	console.log(campground);

    }
	req.flash('success', 'Successfully updated a new campground!');

	res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', async (req, res) => {
	const { id }  = req.params;
	await Campground.findByIdAndDelete(id);
	req.flash('success', 'Successfully deleted a campground!');
	res.redirect('/campgrounds');
})



module.exports = router;