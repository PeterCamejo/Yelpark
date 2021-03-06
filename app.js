if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
//TODO: Get mongoSanitize to work
//const mongoSanitize = require('express-mongo-sanitize');


const User = require('./models/user');

const userRoutes = require('./routes/users');
const parkRoutes = require('./routes/parks');
const reviewRoutes = require('./routes/reviews');

const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/yelpark';
//Local DB mongodb://localhost:27017/yelpark
mongoose.connect(dbURL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
	console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method')); //used for Delete form method
app.use(express.static(path.join(__dirname, 'public')));
//app.use(mongoSanitize);

const secret = process.env.SECRET || 'placeholder';

const mongoStore = new MongoStore({
	mongoUrl: dbURL,
	secret,
	touchAfter: 24 * 60 * 60 //24hours
});

mongoStore.on('error', function(e){
	console.log("SESSION STORE ERROR" , e)
});

const sessionConfig = {
	name: 'session',
	store: mongoStore,
	secret,
	resave: false,
	saveUninitialized: true,
	cookie:{
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //expires in a week
		maxAge:  1000 * 60 * 60 * 24 * 7,
		httpOnly: true
	}
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Flash Middleware//
app.use((req, res, next) =>{
	res.locals.currentUser = req.user;
	res.locals.success  = req.flash('success');
	res.locals.error = req.flash('error');
	next();
})

app.get('/', (req, res)=>{
	res.render('landing');
});

//User Routes//
app.use('/', userRoutes);

//Park Routes//
app.use('/parks', parkRoutes);

//Reviews Routes//
app.use('/parks/:id/reviews' , reviewRoutes);

//Error Routes//
app.all('*', (req,res,next)=>{
	next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
	const {statusCode = 500} = err;
	if(!err.message) err.message = "Something went wrong!";
	res.status(statusCode).render('error' , {err});
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log("Serving on port "+port);
})