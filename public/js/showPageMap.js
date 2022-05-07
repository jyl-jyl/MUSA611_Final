/* global arrayOfDocsHist, historicsite, mapToken */
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/light-v10', // style URL
  center: historicsite.geometry.coordinates, // starting position [lng, lat]
  zoom: 15 // starting zoom
});

const populateMarker =  () => {
  for (let object of arrayOfDocsHist) {
    const coor = object.geometry.coordinates;
    const { name } = object;
    const { address } = object;
    // eslint-disable-next-line no-underscore-dangle
    const id = object._id;
    const html = `<a href="/historicsites/${id}"><h5>${name}</a></h5><p>${address}</p>`;
    let popup = new mapboxgl.Popup({ offset: 25 }).setHTML(html);
    new mapboxgl.Marker()
      .setLngLat(coor)
      .setPopup(popup)
      .addTo(map);
  }
};

populateMarker();

// create the popup for current site
const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
  `<h5>${historicsite.name}</h5><p>${historicsite.address}</p>`
);

new mapboxgl.Marker({ "color": "#b40219" })
  .setLngLat(historicsite.geometry.coordinates)
  .setPopup(popup)
  .addTo(map);


