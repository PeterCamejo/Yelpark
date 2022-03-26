const Joi = require('joi');

//TODO: Figure out how to make images required
module.exports.parkSchema = Joi.object({
	park: Joi.object({
		title: Joi.string().required(),
		price: Joi.number().required().min(0),
		images: Joi.array().items(Joi.object({
				url: Joi.string().required(),
				filename: Joi.string().required()
			})),
		location: Joi.string().required(),
		description: Joi.string().required()
	}).required(),
	deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
	review: Joi.object({
		rating: Joi.number().required().min(1).max(5),
		body: Joi.string().required()
	}).required()
});