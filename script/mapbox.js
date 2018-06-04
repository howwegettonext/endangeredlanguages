// Plot the world's endangered languages on a map
// Requires d3js v4 and MapboxGL

// Define access token
mapboxgl.accessToken = 'pk.eyJ1IjoicmFkaW9lZGl0IiwiYSI6ImNpZ2F4NGw1MzFhaDd0Zmx5NGtoaXBnZTgifQ.LKXJIMW7qqWDRD8QCnMqaw';

// Set up a map
var map = new mapboxgl.Map({
    container: 'earth_div',
    style: 'mapbox://styles/radioedit/cjf9wt0wf6ddu2ro9utbuxjj5',
    center: [0, 20], // lon/lat
    zoom: 0.6 // See most of the map
});

map.scrollZoom.disable();
map.addControl(new mapboxgl.NavigationControl());

// When you click
map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, {
        layers: ['Vulnerable', 'Critically Endangered', 'Severely Endangered', 'Definitely Endangered']
    });

    // If you don't click on anything, do nothing
    if (!features.length) {
        return;
    }

    // If you do, grab the top thing you clicked on
    var feature = features[0];
    
    // Formatting function for speaker number/"unknown"
    let spkrs = (spkrs) => {
        if (isNaN(spkrs)) return spkrs;
        else return format(spkrs);
    };

    // Then display a popup at the location with info
    var popup = new mapboxgl.Popup({
            offset: [0, -15]
        })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(`<b>${feature.properties.name}</b> - ${feature.properties.danger}<br>Speakers: ${spkrs(feature.properties.speakers)}<br><em>${feature.properties.blurb}</em>`)
        .setLngLat(feature.geometry.coordinates)
        .addTo(map);
});