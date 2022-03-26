const {parkSchema, reviewSchema} = require('./joischemas.js');
const Park = require('./models/park');
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) =>{
	if(!req.isAuthenticated()){
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'You must be logged in for that');
		return res.redirect('/login');
	}
	next();
}

module.exports.validatePark = (req, res, next) =>{
	const {error} = parkSchema.validate(req.body);
	if(error){
		const msg = error.details.map(el => el.message).join(",");
		throw new ExpressError(msg, 400);
	}else{
		next();
	}
}

module.exports.validateReview = (req, res, next) =>{
	const {error} = reviewSchema.validate(req.body);
		if(error){
		const msg = error.details.map(el => el.message).join(",");
		throw new ExpressError(msg, 400);
	}else{
		next();
	}
}

module.exports.isOwner = async(req, res, next) =>{
	const {id}= req.params;
	const park = await Park.findById(id);
	if(!park.owner.equals(req.user._id)){
		req.flash('error', 'You do not have permission to do that!');
		return res.redirect(`/parks/${id}`);
	}
	next();
}

module.exports.isReviewOwner = async(req, res, next) =>{
	const {id, reviewId}= req.params;
	const review = await Review.findById(reviewId);
	if(!review.owner.equals(req.user._id)){
		req.flash('error', 'You do not have permission to do that!');
		return res.redirect(`/parks/${id}`);
	}
	next();
}