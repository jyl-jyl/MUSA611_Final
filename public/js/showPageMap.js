
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/light-v10', // style URL
center: historicsite.geometry.coordinates, // starting position [lng, lat]
zoom: 15 // starting zoom
});

// create the popup
const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
	`<h5>${historicsite.name}</h5><p>${historicsite.address}</p>`
);

new mapboxgl.Marker()
.setLngLat(historicsite.geometry.coordinates)
.setPopup(popup)
.addTo(map);


