const Review = require('../models/review');
const Park = require('../models/park');

//Create TODO: Set up so that a user can make only one review per park
module.exports.create = async (req, res) => {
	const park = await Park.findById(req.params.id);
	const review = new Review(req.body.review);
	review.owner = req.user._id;
	park.reviews.push(review);
	await review.save();
	await park.save();
	req.flash('success', 'Successfully added your review!');
	res.redirect(`/parks/${park._id}`);
}

//Delete
module.exports.delete = async (req, res)=>{
	const{id , reviewId} = req.params;
	Park.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
	await Review.findByIdAndDelete(reviewId);
	req.flash('success', 'Successfully deleted your review.');
	res.redirect(`/parks/${id}`);
}