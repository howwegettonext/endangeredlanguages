// Plot the world's endangered languages on a globe
// Requires d3js v4 and webGLearth v2

function initialize() {
	
	// Access the HTML5 geolocation API
	navigator.geolocation.getCurrentPosition(function (position, html5Error) {

		// Set the basic visual options
		var options = {
			zoom: 5,
			position: [position.coords.latitude, position.coords.longitude], // Get user's position from the geolocation API and set as starting position
			bounds: [[-84, -179], [84, 179]],
			minZoom: 2,
			maxZoom: 15
		};

		// Plot the Earth
		var earth = new WE.map('earth_div', options);

		// Load the tiles
		let tiles = WE.tileLayer('https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', options);
		tiles.addTo(earth);

		// Define the tooltip code
		let tooltip = (language) => `<b>${language.name}</b> - ${language.danger}<br>Speakers: ${language.speakers}<br><em>${language.blurb}</em>`

		// Define the language plotting functions
		let langPlot = (languages, category, markerImg) => {
			for (let language of languages.filter(lang => lang.danger == category)) {
				// Create the point
				let point = WE.marker([language.lat, language.lon], markerImg, 10, 10);
				// Add it to the globe
				point.addTo(earth);
				// Give it a tooltip
				point.bindPopup(tooltip(language));
			}
		}

		// Add the points
		d3.csv("data/languages_number.csv",
			function (d) {
				d.speakers = +d.speakers; // Ensure speakers is a number
				if (d.speakers) return d; // Exclude languages without a speaker number
			},
			function (error, languages) {
				if (error) throw error;

				// Make markers for each category of languages
				langPlot(languages, "Vulnerable", "images/vul_marker.png");
				langPlot(languages, "Definitely endangered", "images/def_marker.png");
				langPlot(languages, "Severely endangered", "images/sev_marker.png");
				langPlot(languages, "Critically endangered", "images/cri_marker.png");

			});
	});

}
