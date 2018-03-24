// Plot the world's endangered languages on a map
// Requires d3js v4 and Leaflet 1.3.1

map = L.map('earth_div').setView([7.5, 0], 6);

L.tileLayer('//api.mapbox.com/styles/v1/radioedit/cjf5ok0hf1jpa2sqnu1k0wr1j/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  minZoom: 2,
  accessToken: 'pk.eyJ1IjoicmFkaW9lZGl0IiwiYSI6ImNpZ2F4NGw1MzFhaDd0Zmx5NGtoaXBnZTgifQ.LKXJIMW7qqWDRD8QCnMqaw'
}).addTo(map);

// Make the custom icons
let makeIcon = (marker) => L.icon({
  iconUrl: marker,
  iconSize: [20, 20], // size of the icon
  iconAnchor: [10, 19], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -20] // point from which the popup should open relative to the iconAnchor
});

let vulIcon = makeIcon('images/vul_marker.svg'),
    defIcon = makeIcon('images/def_marker.svg'),
    sevIcon = makeIcon('images/sev_marker.svg'),
    criIcon = makeIcon('images/cri_marker.svg');

let langPlot = (languages, category, icon) => {
  for (let language of languages.filter(lang => lang.danger == category)) {
    // Create the point
    L.marker([language.lat, language.lon], {icon: icon})
      .bindPopup(`<b>${language.name}</b> - ${language.danger}<br>Speakers: ${language.speakers}<br><em>${language.blurb}</em>`)
      .addTo(map);
  }
};

d3.csv("data/languages_number.csv",
  d => {
    d.speakers = +d.speakers; // Ensure speakers is a number
    if (d.speakers) return d; // Exclude languages without a speaker number
  },
  (error, languages) => {
    if (error) throw error;

    // Make markers for each category of languages
    langPlot(languages, "Vulnerable", vulIcon);
    langPlot(languages, "Definitely endangered", defIcon);
    langPlot(languages, "Severely endangered", sevIcon);
    langPlot(languages, "Critically endangered", criIcon);
  });
