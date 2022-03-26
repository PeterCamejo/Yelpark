console.log('test');

mapboxgl.accessToken = mapBoxToken;
const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: park.geometry.coordinates, 
	zoom: 14
});

map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker()
	.setLngLat(park.geometry.coordinates)
	.setPopup(
		new mapboxgl.Popup({offset: 25})
		.setHTML(
			`<h3>${park.title}</h3>`
		)
	)
	.addTo(map);