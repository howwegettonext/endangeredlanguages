// This script calculates the nearest language to the user.

// Set some defaults
let userLat = 0,
	userLon = 0;

// Get the size of the container div and set that as the width and height of the map
let mapWidth = parseInt(d3.select('.nearest').style('width'), 10);

// Define a formatting function for putting commas into numbers
let nearFormat = d3.format(",d");

// Define the map projection and pathing function
let projection = d3.geoAzimuthalEquidistant()
	.scale(mapWidth * 3)
	.translate([mapWidth / 2, mapWidth / 2]);

let path = d3.geoPath()
	.projection(projection);

// Define the colour logic
let nearColour = (d) => {
	switch (d.danger) {
		case "Vulnerable":
			return "#619d94";

		case "Definitely endangered":
			return "#ff8f78";

		case "Severely endangered":
			return "#fc4952";

		case "Critically endangered":
			return "#983d52";

		case "Extinct":
			return "#cccccc";

		default:
			return "blue";
	}
};

// Define a function that calculates the nearest language
let nearLang = (userLat, userLon, languages) => {

	// Start with a null language that's impossibly far away
	let nearestLanguage = {
		name: null,
		distance: 999999999
	};

	// Loop through all the languages
	for (let language of languages) {

		// Figure out how far the language is from the user
		let a = Math.abs(userLat - language.lat),
			b = Math.abs(userLon - language.lon);

		language.distance = Math.sqrt(a * a + b * b);

		// If that's closer than the current-closest language, replace it
		if (language.distance < nearestLanguage.distance)
			nearestLanguage = language;
	}
	// Return the nearest language
	return nearestLanguage;
};

// Create a function to load the languages and analyse the data
let letsGo = () => d3.csv("data/languages_number.csv",
	function (d) {
		d.speakers = +d.speakers; // Ensure speakers is a number
		if (d.speakers) return d; // Exclude languages without a speaker number
	},
	function (error, languages) {
		if (error) throw error;

		// Return the nearest language as an alert.
		// Replace this with drawing a map etc.
		let closest = nearLang(userLat, userLon, languages);

		// Append an SVG, set the width and height
		let nearSVG = d3.select(".nearest")
			.append("svg")
			.attr("width", mapWidth)
			.attr("height", mapWidth);

		projection.center([userLon, userLat]);

		// Draw the map
		let nearMap = d3.json("data/world-50m.json", function (error, world) {
			if (error) throw error;

			var countries = topojson.feature(world, world.objects.countries).features;

			nearSVG.selectAll(".country")
				.data(countries)
				.enter().insert("path", ".graticule")
				.attr("class", "country")
				.attr("d", path)
				.style("fill", "#f4eedf");

			// Calculate where the dot goes
			let coords = projection([closest.lon, closest.lat]);

			// Add the dot representing the language
			let dot = nearSVG.append("circle")
				.attr("cx", coords[0])
				.attr("cy", coords[1])
				.attr("r", 20)
				.style("fill", nearColour(closest));
		});

		d3.select("#nearest-head")
			.text(`Your nearest endangered language is ${closest.name}`);

		d3.select("#nearest-body")
			.html(`Spoken by ${nearFormat(closest.speakers)} speakers, UNESCO classifies it as <span id="unesco">${closest.danger.toLowerCase()}</span>.`);
		
		d3.select("#unesco").style("color", `${nearColour(closest)}`);
	
		console.log(`Your nearest endangered language is ${closest.name}, spoken by ${nearFormat(closest.speakers)} speakers. UNESCO classifies it as ${closest.danger.toLowerCase()}.`);
		
		
	});


// Create a function that executes when the button is clicked
let locApprove = () => {
	// Replace the button with a loading gif
	document.getElementById("nearest-button").style.display = 'none';
	document.getElementById("nearest-loading").style.display = 'block';
	
	// Get the user's actual latitude and longitude
	navigator.geolocation.getCurrentPosition(function (position, html5Error) {
		userLat = position.coords.latitude;
		userLon = position.coords.longitude;
		letsGo();
		
	// Hide the loading gif
	document.getElementById("placeholder").style.display = 'none';
	document.getElementById("nearest-loading").style.display = 'none';
	
	});

};
