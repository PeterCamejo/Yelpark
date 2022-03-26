const mongoose = require('mongoose');
const Park = require('../models/park');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelper');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
//TODO: Hide this token by getting process.env.MAPBOX_TOKEN working
const mapBoxToken = 'pk.eyJ1IjoicGV0ZXJjYW1lam8iLCJhIjoiY2wxNnh1dzEwMDBhZTNicnZiMHY4b3dqNiJ9.cEK5Vak9UmOotKNGT__G_Q'
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

mongoose.connect('mongodb://localhost:27017/yelpark');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
	console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random()* array.length)];


const seedDB = async ()=>{
	await Park.deleteMany({});
	
	for(let i = 0; i < 75 ; i++){
		const randomCity = Math.floor(Math.random() * 1000);
		const city = cities[randomCity].city;
		const state = cities[randomCity].state;
		const location = city +', '+state;
		const geocodeResponse = await geocoder.forwardGeocode({
			query: location,
			limit: 1
		}).send();
		const geometry = geocodeResponse.body.features[0].geometry;
		const price = Math.floor(Math.random() * 20) + 10;
		const park = new Park({
			owner:'623a72850708736a6739f55e',
			location,
			geometry,
			title: sample(descriptors)+" "+sample(places),
			description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Velit egestas dui id ornare. Enim eu turpis egestas pretium. Arcu cursus vitae congue mauris rhoncus aenean vel elit scelerisque. Eros donec ac odio tempor orci dapibus. Vitae suscipit tellus mauris a diam maecenas sed enim. Sed elementum tempus egestas sed. Neque viverra justo nec ultrices dui sapien. Odio morbi quis commodo odio aenean sed.",
			price,
			images: [
				{
					url:'https://res.cloudinary.com/thealex117/image/upload/v1648186922/Yelpark/azgan-mjeshtri-W0lNN2WvaEA-unsplash.jpg',
					filename:'azgan-mjeshtri-W0lNN2WvaEA-unsplash'
				},
				{
					url:'https://res.cloudinary.com/thealex117/image/upload/v1648186923/Yelpark/ignacio-brosa-vJDbPuxUS_s-unsplash.jpg',
					filename:'ignacio-brosa-vJDbPuxUS_s-unsplash'
				}
				
			]
		})
		await park.save();

	}
}

seedDB().then( ()=>{
	mongoose.connection.close();
})