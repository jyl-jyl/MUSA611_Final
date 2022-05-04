if (process.env.NODE_ENV !== "production") {
	require('dotenv').config();
}


const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const HistoricSite = require('./models/historicsite');
const Memory = require('./models/memory');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const { historicsiteSchema, memorySchema } = require('./schema.js');
const historicsites = require('./routes/historicsite');
const memories = require('./routes/memory');


const session = require('express-session');
const flash = require('connect-flash');

mongoose.connect('mongodb://localhost:27017/7th-ward', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	// useFindAndModify: false
});

const db = mongoose.connection;
db.on('err', console.error.bind(console, 'connection error: '));
db.once('open', () => {
	console.log('Database connected');
});







app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// parse the body(url) of post request sent by form
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', ejsMate);



// get an array of all object in database
const arrayOfDocsHist = [];
const pop = async () => {
	for await (const myDoc of HistoricSite.find()) {
		arrayOfDocsHist.push(myDoc);
	}
	console.log(arrayOfDocsHist);

}
pop();




const sessionConfig = {
	secret: 'thisshouldbebettersecret',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	}
}
app.use(session(sessionConfig));
app.use(flash());
app.use((req, res, next) => {
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
})


app.use('/historicsites', historicsites);
app.use('/historicsites/:id/memories', memories);

app.get('/', (req, res) => {
	res.render('home', { arrayOfDocsHist });
})







app.all('*', (req, res, next) =>  {
	// res.send('404!!!!!');
	next(new ExpressError('Page not found...'), 404);
})

app.use((err, req, res, next) => {
	// res.send('oh boy, something went wrong!');
	const { statusCode = 500, message = 'Something went wrong...' } = err;
	res.status(statusCode).render('error', { err });
})

app.listen(5000, () => {
	console.log('SERVING ON PORT 5000 ...');
})