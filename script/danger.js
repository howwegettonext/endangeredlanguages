// Bubble charts of language danger categories

// Grab the size of the container div and set that as the circle diameter
//let boxsingle_diameter = parseInt(d3.select('.box-single').style('width'), 10);

let boxsingle_diameter = 200

// Add svgs to each of the divs
let vul_svg = d3.select(".vulnerable")
	.append("svg")
	.attr("width", boxsingle_diameter)
	.attr("height", boxsingle_diameter),
	def_svg = d3.select(".definitely")
	.append("svg")
	.attr("width", boxsingle_diameter)
	.attr("height", boxsingle_diameter),
	sev_svg = d3.select(".severely")
	.append("svg")
	.attr("width", boxsingle_diameter)
	.attr("height", boxsingle_diameter),
	cri_svg = d3.select(".critically")
	.append("svg")
	.attr("width", boxsingle_diameter)
	.attr("height", boxsingle_diameter);

// Define the circle packing function
let boxsingle_pack = d3.pack()
	.size([boxsingle_diameter, boxsingle_diameter])
	.padding(0.5);

// -------------------------------

// Load the data
d3.csv("data/languages.csv",
	function (d) {
		d.speakers = +d.speakers; // Ensure speakers is a number
		if (d.speakers) return d; // Exclude languages without a speaker number
	},
	function (error, languages) {
		if (error) throw error;

		// Set up the hierarchies for the packing function
		let vul_root = d3.hierarchy({
				children: languages.filter(lang => lang.danger == "Vulnerable").sort(function (a, b) {
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

		let def_root = d3.hierarchy({
				children: languages.filter(lang => lang.danger == "Definitely endangered").sort(function (a, b) {
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

		let sev_root = d3.hierarchy({
				children: languages.filter(lang => lang.danger == "Severely endangered").sort(function (a, b) {
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

		let cri_root = d3.hierarchy({
				children: languages.filter(lang => lang.danger == "Critically endangered").sort(function (a, b) {
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
		let vul_node = vul_svg.selectAll(".node")
			.data(boxsingle_pack(vul_root).leaves()) // Grab the data
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")"; // Move group to position
			});

		let def_node = def_svg.selectAll(".node")
			.data(boxsingle_pack(def_root).leaves()) // Grab the data
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")"; // Move group to position
			});

		let sev_node = sev_svg.selectAll(".node")
			.data(boxsingle_pack(sev_root).leaves()) // Grab the data
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")"; // Move group to position
			});

		let cri_node = cri_svg.selectAll(".node")
			.data(boxsingle_pack(cri_root).leaves()) // Grab the data
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")"; // Move group to position
			});

		// -----------------------------------

		// Add circles to each group
		let vul_circles = vul_node.append("circle")
			.attr("r", function (d) { // Set the radius
				return d.r;
			})
			.style("fill", "#619d94");

		let def_circles = def_node.append("circle")
			.attr("r", function (d) { // Set the radius
				return d.r;
			})
			.style("fill", "#ff8f78");

		let sev_circles = sev_node.append("circle")
			.attr("r", function (d) { // Set the radius
				return d.r;
			})
			.style("fill", "#fc4952");

		let cri_circles = cri_node.append("circle")
			.attr("r", function (d) { // Set the radius
				return d.r;
			})
			.style("fill", "#983d52");

		// ----------------------------------

		// Little HTML tooltips
		vul_node.append("title")
			.text(function (d) {
				return d.data.name + "\n" + d.data.danger + "\n" + "Speakers: " + format(d.data.speakers);
			});

		// Little HTML tooltips
		def_node.append("title")
			.text(function (d) {
				return d.data.name + "\n" + d.data.danger + "\n" + "Speakers: " + format(d.data.speakers);
			});

		// Little HTML tooltips
		sev_node.append("title")
			.text(function (d) {
				return d.data.name + "\n" + d.data.danger + "\n" + "Speakers: " + format(d.data.speakers);
			});

		// Little HTML tooltips
		cri_node.append("title")
			.text(function (d) {
				return d.data.name + "\n" + d.data.danger + "\n" + "Speakers: " + format(d.data.speakers);
			});

		// ------------------------------------------

		// Update function
		function update() {

			// Get new width and height
			boxsingle_diameter = parseInt(d3.select('box-single').style('width'), 10);

			// Redraw the SVGs
			vul_svg.attr("width", boxsingle_diameter)
				.attr("height", boxsingle_diameter);

			def_svg.attr("width", boxsingle_diameter)
				.attr("height", boxsingle_diameter);

			sev_svg.attr("width", boxsingle_diameter)
				.attr("height", boxsingle_diameter);

			cri_svg.attr("width", boxsingle_diameter)
				.attr("height", boxsingle_diameter);

			// Redefine the packing function
			pack.size([boxsingle_diameter, boxsingle_diameter]);

			// Move the dots
			vul_node.data(boxsingle_pack(vul_root).leaves())
				.attr("transform", function (d) {
					return "translate(" + d.x + "," + d.y + ")";
				});

			def_node.data(boxsingle_pack(def_root).leaves())
				.attr("transform", function (d) {
					return "translate(" + d.x + "," + d.y + ")";
				});

			sev_node.data(boxsingle_pack(sev_root).leaves())
				.attr("transform", function (d) {
					return "translate(" + d.x + "," + d.y + ")";
				});

			cri_node.data(boxsingle_pack(cri_root).leaves())
				.attr("transform", function (d) {
					return "translate(" + d.x + "," + d.y + ")";
				});

			// Resize the circles
			vul_circles.attr("r", function (d) {
				return d.r;
			});

			def_circles.attr("r", function (d) {
				return d.r;
			});

			sev_circles.attr("r", function (d) {
				return d.r;
			});

			cri_circles.attr("r", function (d) {
				return d.r;
			});
		}

		// Listen for resize and update
		window.addEventListener("resize", update);

	});
