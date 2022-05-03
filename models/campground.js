const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');


const imageSchema = new Schema({
	url: String,
	filename: String

});

imageSchema.virtual('thumbnail').get(function () {
	return this.url.replace('/upload', '/upload/w_200');

});

const campGroundSchema = new Schema({
	title: String,
	location: String,
	image: [imageSchema],
	price: Number,
	description: String,
	geometry: {
		type: {
			type: String, 
			enum: ['Point'],
			required: true
		},
		coordinates: {
			type: [Number],
			required: true
		}
	},
	reviews: [
	{
		type: Schema.Types.ObjectId,
		ref: 'Review'
	}
	]
});

campGroundSchema.post('findOneAndDelete', async function (doc) {
	if (doc) {
		await Review.remove({
			_id: {
				$in: doc.reviews
			}
		})
	}
})

module.exports = mongoose.model('Campground', campGroundSchema);

