// This script calculates the nearest language to the user.

// Set some defaults
let userLat = 0,
	userLon = 0;

// Define a formatting function for putting commas into numbers
let format = d3.format(",d");

// Define a function that calculates the nearest language
let nearestLang = (userLat, userLon, languages) => {

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
		let closest = nearestLang(userLat, userLon, languages);
		alert(`Your nearest endangered language is ${closest.name}, spoken by ${format(closest.speakers)} speakers. UNESCO classifies it as ${closest.danger.toLowerCase()}.`);
	});


// Create a function that executes when the button is clicked
let locApprove = () => {
	// Get the user's actual latitude and longitude
	navigator.geolocation.getCurrentPosition(function (position, html5Error) {
		userLat = position.coords.latitude;
		userLon = position.coords.longitude;
		letsGo();
	});

};
