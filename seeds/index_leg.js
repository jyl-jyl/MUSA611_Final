const mongoose = require('mongoose');
const cities = require('./cities');
const Campground = require('../models/campground');
const { places, descriptors } = require('./seedHelpers');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const db = mongoose.connection;
db.on('err', console.error.bind(console, 'connection error: '));
db.once('open', () => {
	console.log('Database connected');
});

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 50 ; i ++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod.',
			price,
			image:  [
			{
				url: 'https://res.cloudinary.com/dgmbzj4cy/image/upload/v1651518766/YelpCamp/lv7glkgccrabpa5cdqss.png',
				filename: 'YelpCamp/lv7glkgccrabpa5cdqss',
			},
			{
				url: 'https://res.cloudinary.com/dgmbzj4cy/image/upload/v1651518767/YelpCamp/t2ifekd394zaugd5gfve.bmp',
				filename: 'YelpCamp/t2ifekd394zaugd5gfve',
			}
			],
			geometry: {
				type: "Point",
				coordinates: [-75.1652215, 39.9525839],
			}
		});
		await camp.save();
	}

};

seedDB()
.then(() => {
	mongoose.connection.close();
})