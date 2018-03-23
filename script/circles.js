// Draw a bubble chart of the world's languages
// Adapted from: https://bl.ocks.org/mbostock/4063269

// Grab the size of the container div and set that as the circle diameter
let diameter = parseInt(d3.select('#bigcircle').style('width'), 10);

// Add an svg of the right size to the circle div
let svg = d3.select("#bigcircle")
    .append("svg")
    .attr("width", diameter)
    .attr("height", diameter);

// Set a number formatter for the tooltips
let format = d3.format(",d");

// Define the circle packing function
let pack = d3.pack()
    .size([diameter, diameter])
    .padding(0.5)
    .radius(function (d) {
        return Math.sqrt(d.value * boxsingle_diameter / 2000000);
    });

// --------------------------
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

// --------------------------
// Continents

// Grab the size of the container div and set that as the circle diameter
let countrybox_diameter = parseInt(d3.select('.box').style('width'), 10);

// Add svgs to each of the divs
let countrySVG = (selector) => d3.select(selector)
    .append("svg")
    .attr("width", countrybox_diameter)
    .attr("height", countrybox_diameter);

let as_svg = countrySVG(".asia"),
    af_svg = countrySVG(".africa"),
    eu_svg = countrySVG(".europe"),
    na_svg = countrySVG(".namerica"),
    sa_svg = countrySVG(".samerica"),
    oc_svg = countrySVG(".oceania");

// Define the circle packing function
let countrybox_pack = d3.pack()
    .size([countrybox_diameter, countrybox_diameter])
    .padding(0.5)
    .radius(function (d) {
        return Math.sqrt(d.value * boxsingle_diameter / 2000000);
    });

// Define a function to set up the hierarchies for packing function
let continentHier = (languages, continent) => d3.hierarchy({
    children: languages.filter(lang => lang.continents.includes(continent))
}).sum(function (d) {
    return d.speakers; // This defines the size of the circle
});

// Define a function to create a group for each circle through a normal D3 data join
let continentGroups = (svg, hierarchy) => svg.selectAll(".node")
    .data(countrybox_pack(hierarchy).leaves()) // Grab the data
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")"; // Move group to position
    });

// Define a function to add circles and HTML titles to each group
let continentFill = (group) => {
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
        .style("fill", function (d) { // Set the colours
            switch (d.data.danger) {
                case "Vulnerable":
                    return "#619d94";

                case "Definitely endangered":
                    return "#ff8f78";

                case "Severely endangered":
                    return "#fc4952";

                case "Critically endangered":
                    return "#983d52";

                default:
                    return "blue";
            }
        });
};

// Define a function to redraw the SVGs on resize
let redrawContinentSVG = (svg) => svg
    .attr("width", countrybox_diameter)
    .attr("height", countrybox_diameter);

// Define a function to move the dots on resize
let moveContinentDots = (node, hierarchy) => node.data(countrybox_pack(hierarchy).leaves())
    .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
    });

// Define a function to resize the dots on resize
let continentResize = (circles) => circles.attr("r", function (d) {
    return d.r;
});


// Load the data
d3.csv("data/languages_name.csv",
    function (d) {
        d.speakers = +d.speakers; // Ensure speakers is a number
        d.continents = d.continents.split(" ")
            .filter(function (value, index, self) {
                return self.indexOf(value) === index;
            }); // Make an array of unique continents per language
        if (d.speakers) return d; // Exclude languages without a speaker number
    },
    function (error, languages) {
        if (error) throw error;


        // Big circle
        // This sets up a hierarchy so the circle packing function works
        let root = d3.hierarchy({
                children: languages.filter(lang => lang.danger != "Extinct")
            })
            .sum(function (d) {
                return d.speakers; // This defines the size of the circle
            });

        // This plots a group for each circle,  through a normal D3 data join
        let node = svg.selectAll(".node")
            .data(pack(root).leaves()) // Grab the data
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")"; // Move group to position
            });

        // Add circles to each group
        let circles = node.append("circle")
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

                    default:
                        return "blue";
                }
            });

        // Little HTML tooltips
        node.append("title")
            .text(function (d) {
                return d.data.name + "\n" + d.data.danger + "\n" + "Speakers: " + format(d.data.speakers);
            });

        // Danger
        // Set up the hierarchies for the packing function
        let vul_root = dangerHier(languages, "Vulnerable"),
            def_root = dangerHier(languages, "Definitely endangered"),
            sev_root = dangerHier(languages, "Severely endangered"),
            cri_root = dangerHier(languages, "Critically endangered");

        // This plots a group for each circle,  through a normal D3 data join
        let vul_node = dangerGroups(vul_svg, vul_root),
            def_node = dangerGroups(def_svg, def_root),
            sev_node = dangerGroups(sev_svg, sev_root),
            cri_node = dangerGroups(cri_svg, cri_root);

        // Add circles and titles to each group
        let vul_circles = dangerFill(vul_node, "#619d94"),
            def_circles = dangerFill(def_node, "#ff8f78"),
            sev_circles = dangerFill(sev_node, "#fc4952"),
            cri_circles = dangerFill(cri_node, "#983d52");

        // Continents
        // Set up the hierarchies for the packing function
        let as_root = continentHier(languages, "AS"),
            af_root = continentHier(languages, "AF"),
            eu_root = continentHier(languages, "EU"),
            na_root = continentHier(languages, "NA"),
            sa_root = continentHier(languages, "SA"),
            oc_root = continentHier(languages, "OC");

        // This plots a group for each circle,  through a normal D3 data join
        let as_node = continentGroups(as_svg, as_root),
            af_node = continentGroups(af_svg, af_root),
            eu_node = continentGroups(eu_svg, eu_root),
            na_node = continentGroups(na_svg, na_root),
            sa_node = continentGroups(sa_svg, sa_root),
            oc_node = continentGroups(oc_svg, oc_root);

        // Add circles to each group
        let as_circles = continentFill(as_node),
            af_circles = continentFill(af_node),
            eu_circles = continentFill(eu_node),
            na_circles = continentFill(na_node),
            sa_circles = continentFill(sa_node),
            oc_circles = continentFill(oc_node);

        // ------------------------------------------

        // Update function
        function update() {

            //Big Circle
            // Get new width and height
            diameter = parseInt(d3.select('#bigcircle').style('width'), 10);

            // Redraw the SVG
            svg.attr("width", diameter)
                .attr("height", diameter);

            // Redefine the packing function
            pack.size([diameter, diameter])
                .radius(function (d) {
                    return Math.sqrt(d.value * boxsingle_diameter / 2000000);
                });

            // Move the dots
            node.data(pack(root).leaves())
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

            // Resize the circles
            circles.attr("r", function (d) {
                return d.r;
            });

            // Danger
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

            // Continents
            // Get new width and height
            countrybox_diameter = parseInt(d3.select('.box').style('width'), 10);

            // Redraw the SVGs
            redrawContinentSVG(as_svg);
            redrawContinentSVG(af_svg);
            redrawContinentSVG(eu_svg);
            redrawContinentSVG(na_svg);
            redrawContinentSVG(sa_svg);
            redrawContinentSVG(oc_svg);

            // Redefine the packing function
            countrybox_pack.size([countrybox_diameter, countrybox_diameter])
                .radius(function (d) {
                    return Math.sqrt(d.value * boxsingle_diameter / 2000000);
                });

            // Move the dots
            moveContinentDots(as_node, as_root);
            moveContinentDots(af_node, af_root);
            moveContinentDots(eu_node, eu_root);
            moveContinentDots(na_node, na_root);
            moveContinentDots(sa_node, sa_root);
            moveContinentDots(oc_node, oc_root);

            // Resize the circles
            continentResize(as_circles);
            continentResize(af_circles);
            continentResize(eu_circles);
            continentResize(na_circles);
            continentResize(sa_circles);
            continentResize(oc_circles);
        }

        // Listen for resize and update
        window.addEventListener("resize", update);

    });
