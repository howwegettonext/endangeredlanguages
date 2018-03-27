// Plot the world's endangered languages on a map
// Requires d3js v4 and MapboxGL

mapboxgl.accessToken = 'pk.eyJ1IjoicmFkaW9lZGl0IiwiYSI6ImNpZ2F4NGw1MzFhaDd0Zmx5NGtoaXBnZTgifQ.LKXJIMW7qqWDRD8QCnMqaw';

var map = new mapboxgl.Map({
    container: 'earth_div',
    style: 'mapbox://styles/radioedit/cjf9wt0wf6ddu2ro9utbuxjj5',
    center: [0,20],
    zoom: 0.6
});

map.on('click', function(e) {
  var features = map.queryRenderedFeatures(e.point, {
    layers: ['Vulnerable', 'Critically Endangered', 'Severely Endangered', 'Definitely Endangered']
  });

  if (!features.length) {
    return;
  }

  var feature = features[0];

  var popup = new mapboxgl.Popup({ offset: [0, -15] })
    .setLngLat(feature.geometry.coordinates)
    .setHTML(`<b>${feature.properties.name}</b> - ${feature.properties.danger}<br>Speakers: ${format(feature.properties.speakers)}<br><em>${feature.properties.blurb}</em>`)
    .setLngLat(feature.geometry.coordinates)
    .addTo(map);
});