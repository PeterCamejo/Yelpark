const Park = require('../models/park');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const { cloudinary } = require('../images');

//Render Index
module.exports.index = async (req, res) => {
	const parks = await Park.find({});
	res.render('parks/index', {parks});
};

//Render New Park form
module.exports.renderNew = (req, res) =>{
	res.render('parks/new');
};

//Create
module.exports.create = async (req, res, next) => {
		const geocodeResponse = await geocoder.forwardGeocode({
			query: req.body.park.location,
			limit: 1
		}).send();
		const park = new Park(req.body.park);
		park.geometry = geocodeResponse.body.features[0].geometry;
		park.owner = req.user._id;
		park.images = req.files.map(f => ({url: f.path , filename: f.filename}));
		await park.save();
		req.flash('success', 'Successfully made a new park!');
		res.redirect(`/parks/${park._id}`);
}

//Show
module.exports.show = async(req, res) =>{
	const park = await Park.findById(req.params.id).populate({
		path: 'reviews',
		populate:{
			path: 'owner'  //nest populate for review owners
		}
	}).populate('owner');
	if(!park){
		req.flash('error', 'Park not found!');
		return res.redirect('/parks');
	}
	res.render('parks/show', {park});
}

//Render Edit form
module.exports.renderEdit = async (req, res) =>{
	const park = await Park.findById(req.params.id);
	if(!park){
		req.flash('error', 'Park not found!');
		return res.redirect('/parks');
	}
	
	res.render('parks/edit', {park});
}

//Update/Edit
module.exports.update = async (req, res) =>{
	const {id} = req.params;
	const park = await Park.findByIdAndUpdate(id, {...req.body.park});
	const imgs = req.files.map(f => ({url: f.path , filename: f.filename}));
	park.images.push(...imgs);
	await park.save();

	if(req.body.deleteImages){
		for(let file of req.body.deleteImages){
			await cloudinary.uploader.destroy(file);
		}
		await park.updateOne({$pull:{images: {filename: {$in: req.body.deleteImages}}}});
	}

	req.flash('success' , 'Successfully updated the park!');
	res.redirect(`/parks/${park._id}`)
}

//Delete TODO: Once multiple parks arent using the same images, set up removing Cloudinary images when its park is deleted.
module.exports.delete = async (req, res) =>{
	const {id} = req.params;
	await Park.findByIdAndDelete(id);
	req.flash('success', "Successfully deleted the park");
	res.redirect('/parks');
}
