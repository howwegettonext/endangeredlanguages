// Bubble charts of language danger categories

// Grab the size of the container div and set that as the circle diameter
let countrybox_diameter = parseInt(d3.select('.box').style('width'), 10);

// Add svgs to each of the divs
let as_svg = d3.select(".asia")
	.append("svg")
	.attr("width", countrybox_diameter)
	.attr("height", countrybox_diameter),
	af_svg = d3.select(".africa")
	.append("svg")
	.attr("width", countrybox_diameter)
	.attr("height", countrybox_diameter),
	eu_svg = d3.select(".europe")
	.append("svg")
	.attr("width", countrybox_diameter)
	.attr("height", countrybox_diameter),
	na_svg = d3.select(".namerica")
	.append("svg")
	.attr("width", countrybox_diameter)
	.attr("height", countrybox_diameter),
	sa_svg = d3.select(".samerica")
	.append("svg")
	.attr("width", countrybox_diameter)
	.attr("height", countrybox_diameter),
	oc_svg = d3.select(".oceania")
	.append("svg")
	.attr("width", countrybox_diameter)
	.attr("height", countrybox_diameter);

// Define the circle packing function
let countrybox_pack = d3.pack()
	.size([countrybox_diameter, countrybox_diameter])
	.padding(0.5)
	.radius(function (d) {
		return Math.sqrt(d.value * countrybox_diameter / 2000000);
	});

// -------------------------------

// Load the data
d3.csv("data/languages.csv",
	function (d) {
		d.speakers = +d.speakers; // Ensure speakers is a number
		d.continents = d.continents.split(" ")
			.filter(function (value, index, self) {
				return self.indexOf(value) === index;
			}); // Make an array of unique continents per language

		if (d.speakers) return d; // Exclude languages without a number of speakers
	},
	function (error, languages) {
		if (error) throw error;

		// Set up the hierarchies for the packing function
		let as_root = d3.hierarchy({
				children: languages.filter(lang => lang.continents.includes("AS")).sort(function (a, b) {
					var nameA = a.name.toLowerCase(),
						nameB = b.name.toLowerCase();
					if (nameA < nameB) //sort string ascending
						return -1;
					if (nameA > nameB)
						return 1;
					return 0; //default return value (no sorting)
				}) // This is where the data is input
			})
			.sum(function (d) {
				return d.speakers; // This defines the size of the circle
			});

		let af_root = d3.hierarchy({
				children: languages.filter(lang => lang.continents.includes("AF")).sort(function (a, b) {
					var nameA = a.name.toLowerCase(),
						nameB = b.name.toLowerCase();
					if (nameA < nameB) //sort string ascending
						return -1;
					if (nameA > nameB)
						return 1;
					return 0; //default return value (no sorting)
				}) // This is where the data is input
			})
			.sum(function (d) {
				return d.speakers; // This defines the size of the circle
			});

		let eu_root = d3.hierarchy({
				children: languages.filter(lang => lang.continents.includes("EU")).sort(function (a, b) {
					var nameA = a.name.toLowerCase(),
						nameB = b.name.toLowerCase();
					if (nameA < nameB) //sort string ascending
						return -1;
					if (nameA > nameB)
						return 1;
					return 0; //default return value (no sorting)
				}) // This is where the data is input
			})
			.sum(function (d) {
				return d.speakers; // This defines the size of the circle
			});

		let na_root = d3.hierarchy({
				children: languages.filter(lang => lang.continents.includes("NA")).sort(function (a, b) {
					var nameA = a.name.toLowerCase(),
						nameB = b.name.toLowerCase();
					if (nameA < nameB) //sort string ascending
						return -1;
					if (nameA > nameB)
						return 1;
					return 0; //default return value (no sorting)
				}) // This is where the data is input
			})
			.sum(function (d) {
				return d.speakers; // This defines the size of the circle
			});

		let sa_root = d3.hierarchy({
				children: languages.filter(lang => lang.continents.includes("SA")).sort(function (a, b) {
					var nameA = a.name.toLowerCase(),
						nameB = b.name.toLowerCase();
					if (nameA < nameB) //sort string ascending
						return -1;
					if (nameA > nameB)
						return 1;
					return 0; //default return value (no sorting)
				}) // This is where the data is input
			})
			.sum(function (d) {
				return d.speakers; // This defines the size of the circle
			});

		let oc_root = d3.hierarchy({
				children: languages.filter(lang => lang.continents.includes("OC")).sort(function (a, b) {
					var nameA = a.name.toLowerCase(),
						nameB = b.name.toLowerCase();
					if (nameA < nameB) //sort string ascending
						return -1;
					if (nameA > nameB)
						return 1;
					return 0; //default return value (no sorting)
				}) // This is where the data is input
			})
			.sum(function (d) {
				return d.speakers; // This defines the size of the circle
			});

		// ----------------------------------------------------

		// This plots a group for each circle,  through a normal D3 data join
		let as_node = as_svg.selectAll(".node")
			.data(countrybox_pack(as_root).leaves()) // Grab the data
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")"; // Move group to position
			});

		let af_node = af_svg.selectAll(".node")
			.data(countrybox_pack(af_root).leaves()) // Grab the data
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")"; // Move group to position
			});

		let eu_node = eu_svg.selectAll(".node")
			.data(countrybox_pack(eu_root).leaves()) // Grab the data
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")"; // Move group to position
			});

		let na_node = na_svg.selectAll(".node")
			.data(countrybox_pack(na_root).leaves()) // Grab the data
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")"; // Move group to position
			});

		let sa_node = sa_svg.selectAll(".node")
			.data(countrybox_pack(sa_root).leaves()) // Grab the data
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")"; // Move group to position
			});

		let oc_node = oc_svg.selectAll(".node")
			.data(countrybox_pack(oc_root).leaves()) // Grab the data
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")"; // Move group to position
			});



		// -----------------------------------

		// Add circles to each group
		let as_circles = as_node.append("circle")
			.attr("r", function (d) { // Set the radius
				return d.r;
			})
			.style("fill", function (d) { // This sets the colours
				switch (d.data.danger) {
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
			});

		let af_circles = af_node.append("circle")
			.attr("r", function (d) { // Set the radius
				return d.r;
			})
			.style("fill", function (d) { // This sets the colours
				switch (d.data.danger) {
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
			});

		let eu_circles = eu_node.append("circle")
			.attr("r", function (d) { // Set the radius
				return d.r;
			})
			.style("fill", function (d) { // This sets the colours
				switch (d.data.danger) {
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
			});

		let na_circles = na_node.append("circle")
			.attr("r", function (d) { // Set the radius
				return d.r;
			})
			.style("fill", function (d) { // This sets the colours
				switch (d.data.danger) {
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
			});

		let sa_circles = sa_node.append("circle")
			.attr("r", function (d) { // Set the radius
				return d.r;
			})
			.style("fill", function (d) { // This sets the colours
				switch (d.data.danger) {
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
			});

		let oc_circles = oc_node.append("circle")
			.attr("r", function (d) { // Set the radius
				return d.r;
			})
			.style("fill", function (d) { // This sets the colours
				switch (d.data.danger) {
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
			});

		// ----------------------------------

		// Little HTML tooltips
		as_node.append("title")
			.text(function (d) {
				return d.data.name + "\n" + d.data.danger + "\n" + "Speakers: " + format(d.data.speakers);
			});

		af_node.append("title")
			.text(function (d) {
				return d.data.name + "\n" + d.data.danger + "\n" + "Speakers: " + format(d.data.speakers);
			});

		eu_node.append("title")
			.text(function (d) {
				return d.data.name + "\n" + d.data.danger + "\n" + "Speakers: " + format(d.data.speakers);
			});

		na_node.append("title")
			.text(function (d) {
				return d.data.name + "\n" + d.data.danger + "\n" + "Speakers: " + format(d.data.speakers);
			});

		sa_node.append("title")
			.text(function (d) {
				return d.data.name + "\n" + d.data.danger + "\n" + "Speakers: " + format(d.data.speakers);
			});

		oc_node.append("title")
			.text(function (d) {
				return d.data.name + "\n" + d.data.danger + "\n" + "Speakers: " + format(d.data.speakers);
			});

		// ------------------------------------------

		// Update function
		function update() {

			// Get new width and height
			countrybox_diameter = parseInt(d3.select('.box').style('width'), 10);

			// Redraw the SVGs
			as_svg.attr("width", countrybox_diameter)
				.attr("height", countrybox_diameter);

			af_svg.attr("width", countrybox_diameter)
				.attr("height", countrybox_diameter);

			eu_svg.attr("width", countrybox_diameter)
				.attr("height", countrybox_diameter);

			na_svg.attr("width", countrybox_diameter)
				.attr("height", countrybox_diameter);

			sa_svg.attr("width", countrybox_diameter)
				.attr("height", countrybox_diameter);

			oc_svg.attr("width", countrybox_diameter)
				.attr("height", countrybox_diameter);

			// Redefine the packing function
			countrybox_pack.size([countrybox_diameter, countrybox_diameter])
				.radius(function (d) {
					return Math.sqrt(d.value * countrybox_diameter / 2000000);
				});

			// Move the dots
			as_node.data(countrybox_pack(as_root).leaves())
				.attr("transform", function (d) {
					return "translate(" + d.x + "," + d.y + ")";
				});
			
			af_node.data(countrybox_pack(af_root).leaves())
				.attr("transform", function (d) {
					return "translate(" + d.x + "," + d.y + ")";
				});
			
			eu_node.data(countrybox_pack(eu_root).leaves())
				.attr("transform", function (d) {
					return "translate(" + d.x + "," + d.y + ")";
				});
			
			na_node.data(countrybox_pack(na_root).leaves())
				.attr("transform", function (d) {
					return "translate(" + d.x + "," + d.y + ")";
				});
			
			sa_node.data(countrybox_pack(sa_root).leaves())
				.attr("transform", function (d) {
					return "translate(" + d.x + "," + d.y + ")";
				});
			
			oc_node.data(countrybox_pack(oc_root).leaves())
				.attr("transform", function (d) {
					return "translate(" + d.x + "," + d.y + ")";
				});

			

			// Resize the circles
			as_circles.attr("r", function (d) {
				return d.r;
			});
			
			af_circles.attr("r", function (d) {
				return d.r;
			});
			
			eu_circles.attr("r", function (d) {
				return d.r;
			});
			
			na_circles.attr("r", function (d) {
				return d.r;
			});
			
			sa_circles.attr("r", function (d) {
				return d.r;
			});
			
			oc_circles.attr("r", function (d) {
				return d.r;
			});

		}

		// Listen for resize and update
		window.addEventListener("resize", update);

	});
