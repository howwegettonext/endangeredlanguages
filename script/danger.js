// Bubble charts of language danger categories

// Grab the size of the container div and set that as the circle diameter
let boxsingle_diameter = parseInt(d3.select('.box-single').style('width'), 10);

// Add svgs to each of the divs
let dangerSVG = (selector) => d3.select(selector)
	.append("svg")
	.attr("width", boxsingle_diameter)
	.attr("height", boxsingle_diameter);

let vul_svg = dangerSVG(".vulnerable"),
	def_svg = dangerSVG(".definitely"),
	sev_svg = dangerSVG(".severely"),
	cri_svg = dangerSVG(".critically");

// Define the circle packing function
let boxsingle_pack = d3.pack()
	.size([boxsingle_diameter, boxsingle_diameter])
	.padding(0.5)
	.radius(function (d) {
		return Math.sqrt(d.value * boxsingle_diameter / 2000000);
	});

// Define a function to set up the hierarchies for packing function
let dangerHier = (languages, danger) => d3.hierarchy({
		children: languages.filter(lang => lang.danger == danger)
	})
	.sum(function (d) {
		return d.speakers; // This defines the size of the circle
	});

// Define a function to create a group for each circle through a normal D3 data join
let dangerGroups = (svg, hierarchy) => svg.selectAll(".node")
	.data(boxsingle_pack(hierarchy).leaves()) // Grab the data
	.enter().append("g") // Add a group for each datapoint
	.attr("class", "node")
	.attr("transform", function (d) {
		return "translate(" + d.x + "," + d.y + ")"; // Move group to position
	});

// Define a function to add circles and HTML titles to each group
let dangerFill = (group, fill) => {
	// First stick a title on it
	group.append("title")
		.text(function (d) {
			return d.data.name + "\n" + d.data.danger + "\n" + "Speakers: " + format(d.data.speakers);
		});
	// Then return the circle so we can adjust radii later
	return group.append("circle") 
		.attr("r", function (d) { // Set the radius
			return d.r;
		})
		.style("fill", fill);
};

// Define a function to redraw the SVGs on resize
let redrawDangerSVG = (svg) => svg
				.attr("width", boxsingle_diameter)
				.attr("height", boxsingle_diameter);

// Define a function to move the dots on resize
let moveDangerDots = (node, hierarchy) => node.data(boxsingle_pack(hierarchy).leaves())
				.attr("transform", function (d) {
					return "translate(" + d.x + "," + d.y + ")";
				});

// Define a function to resize the dots on resize
let dangerResize = (circles) => circles.attr("r", function (d) {
				return d.r;
			});

// -------------------------------

// Load the data
d3.csv("data/languages_name.csv",
	function (d) {
		d.speakers = +d.speakers; // Ensure speakers is a number
		if (d.speakers) return d; // Exclude languages without a speaker number
	},
	function (error, languages) {
		if (error) throw error;

		// Set up the hierarchies for the packing function
		let vul_root = dangerHier(languages, "Vulnerable"),
			def_root = dangerHier(languages, "Definitely endangered"),
			sev_root = dangerHier(languages, "Severely endangered"),
			cri_root = dangerHier(languages, "Critically endangered");

		// ----------------------------------------------------

		// This plots a group for each circle,  through a normal D3 data join
		let vul_node = dangerGroups(vul_svg, vul_root),
			def_node = dangerGroups(def_svg, def_root),
			sev_node = dangerGroups(sev_svg, sev_root),
			cri_node = dangerGroups(cri_svg, cri_root);

		// -----------------------------------

		// Add circles and titles to each group
		let vul_circles = dangerFill(vul_node, "#619d94"),
			def_circles = dangerFill(def_node, "#ff8f78"),
			sev_circles = dangerFill(sev_node, "#fc4952"),
			cri_circles = dangerFill(cri_node, "#983d52");

		// ------------------------------------------

		// Define an update function
		function update() {

			// Get new width and height
			boxsingle_diameter = parseInt(d3.select('.box-single').style('width'), 10);

			//  Redraw the SVGs
			redrawDangerSVG(vul_svg);
			redrawDangerSVG(def_svg);
			redrawDangerSVG(sev_svg);
			redrawDangerSVG(cri_svg);

			// Redefine the packing function
			boxsingle_pack.size([boxsingle_diameter, boxsingle_diameter])
				.radius(function (d) {
					return Math.sqrt(d.value * boxsingle_diameter / 2000000);
				});

			// Move the dots
			moveDangerDots(vul_node, vul_root);
			moveDangerDots(def_node, def_root);
			moveDangerDots(sev_node, sev_root);
			moveDangerDots(cri_node, cri_root);

			// Resize the circles
			dangerResize(vul_circles);
			dangerResize(def_circles);
			dangerResize(sev_circles);
			dangerResize(vul_circles);

			// Listen for resize and update
			window.addEventListener("resize", update);
		}
	});