
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/light-v10', // style URL
center: campground.geometry.coordinates, // starting position [lng, lat]
zoom: 20 // starting zoom
});

// create the popup
const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
	`<h5>${campground.title}</h5><p>${campground.location}</p>`
);

new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(popup)
.addTo(map);


