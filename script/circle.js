// Select the svg, then pull the diameter of the circle from it
var svg = d3.select("svg"),
	diameter = +svg.attr("width");

// Set a number formatter for the tooltips
var format = d3.format(",d");

// Define the circle packing function
var pack = d3.pack()
	.size([diameter, diameter])
	.padding(0.5);

// Load the data
d3.csv("../data/languages.csv",
	function (d) {
		d.speakers = +d.speakers; // Ensure speakers is a number
		if (d.speakers) return d; // Exclude languages without a speaker number
	},
	function (error, languages) {
		if (error) throw error;

		// This sets up a hierarchy so the circle packing function works
		var root = d3.hierarchy({
				children: languages // This is where the data is input
			})
			.sum(function (d) {
				return d.speakers; // This defines the size of the circle
			});

		// This plots a group for each circle,  through a normal D3 data join
		var node = svg.selectAll(".node")
			.data(pack(root).leaves()) // Grab the data
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")"; // Move group to position
			});

		// Add circles to each group
		node.append("circle")
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

		// Little HTML tooltips
		node.append("title")
			.text(function (d) {
				return d.data.name + "\n" + d.data.danger + "\n" + "Speakers: " + format(d.data.speakers);
			});
	});
