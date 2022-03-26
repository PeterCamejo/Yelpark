const express = require('express');
const router = express.Router({mergeParams: true});
const reviewControl = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');
const {validateReview, isLoggedIn, isReviewOwner} = require('../middleware');

//Create
router.post('/', isLoggedIn, validateReview, catchAsync(reviewControl.create));

//Delete
router.delete('/:reviewId', isLoggedIn, isReviewOwner, catchAsync(reviewControl.delete));

module.exports = router;