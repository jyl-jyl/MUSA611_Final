const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const imageSchema = require('./image');


const memorySchema = new Schema({
	title: String,
	story: String,	
	image: [imageSchema],

})

module.exports = mongoose.model("Memory", memorySchema);