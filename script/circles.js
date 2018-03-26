// Draw a bubble chart of the world's languages
// Originally adapted from: https://bl.ocks.org/mbostock/4063269

// Grab the size of the container div and set that as the circle diameter
let diameter = parseInt(d3.select('#bigcircle').style('width'), 10);
let boxsingle_diameter = parseInt(d3.select('.box-single').style('width'), 10);
let countrybox_diameter = parseInt(d3.select('.box').style('width'), 10);

// Set a number formatter for the tooltips
let format = d3.format(",d");

// Set a colour scheme
let colourPicker = function (d) {
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
};

// Add an svg of the right size to each circle div
let makeSVG = (selector, width) => d3.select(selector)
    .append("svg")
    .attr("width", width)
    .attr("height", width);

// Define the circle packing function
let pack = (size) => d3.pack()
    .size([size, size])
    .padding(0.5)
    .radius(function (d) {
        return Math.sqrt(d.value * diameter / 3500000);
    });

let big_pack = pack(diameter),
    boxsingle_pack = pack(boxsingle_diameter),
    countrybox_pack = pack(countrybox_diameter);

// Define function to set up the hierarchies for packing function
let hierarchy = (languages, theFilter) => {
    return d3.hierarchy({
            children: languages.filter(theFilter)
        })
        .sum(function (d) {
            return d.speakers; // This defines the size of the circle
        });
};

// Define function to create a group for each circle through a normal D3 data join
let group = (svg, hierarchy, packer) => svg.selectAll(".node")
    .data(packer(hierarchy).leaves()) // Grab the data
    .enter().append("g") // Add a group for each datapoint
    .attr("class", "node")
    .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")"; // Move group to position
    });

// Define a function to add circles and HTML titles to each group
let fill = (group, fill) => {
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
let redrawSVG = (svg, width) => svg
    .attr("width", width)
    .attr("height", width);

// Define a function to move the dots on resize
let moveDots = (node, hierarchy, packer) => node.data(packer(hierarchy).leaves())
    .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
    });

// Define a function to resize the dots on page resize
let resize = (circles) => circles.attr("r", function (d) {
    return d.r;
});

// Define a datacleaning function to run when data is loaded
let cleanData = function (d) {
    d.speakers = +d.speakers; // Ensure speakers is a number
    d.continents = d.continents.split(" ")
        .filter(function (value, index, self) {
            return self.indexOf(value) === index;
        }); // Make an array of unique continents per language
    if (d.speakers) return d; // Exclude languages without a speaker number
};

let big_svg, vul_svg, def_svg, sev_svg, cri_svg, as_svg, af_svg, eu_svg, na_svg, sa_svg, oc_svg;
let as_caption, af_caption, eu_caption, na_caption, sa_caption, oc_caption, textScaleFactor, lilTextScaleFactor, makeBigCap, makeLilCap, bigSize, lilSize;
let root, vul_root, def_root, sev_root, cri_root, as_root, af_root, eu_root, na_root, sa_root, oc_root;
let node, vul_node, def_node, sev_node, cri_node, as_node, af_node, eu_node, na_node, sa_node, oc_node;
let circles, vul_circles, def_circles, sev_circles, cri_circles, as_circles, af_circles, eu_circles, na_circles, sa_circles, oc_circles;
let scaleWidth, scaleHeight, scale_svg, scale_numbers, scale_circles, scale_text;

function initialise(languages) {
    // Add an svg of the right size to each circle div
    big_svg = makeSVG("#bigcircle", diameter);
    vul_svg = makeSVG(".vulnerable", boxsingle_diameter);
    def_svg = makeSVG(".definitely", boxsingle_diameter);
    sev_svg = makeSVG(".severely", boxsingle_diameter);
    cri_svg = makeSVG(".critically", boxsingle_diameter);
    as_svg = makeSVG(".asia", countrybox_diameter);
    af_svg = makeSVG(".africa", countrybox_diameter);
    eu_svg = makeSVG(".europe", countrybox_diameter);
    na_svg = makeSVG(".namerica", countrybox_diameter);
    sa_svg = makeSVG(".samerica", countrybox_diameter);
    oc_svg = makeSVG(".oceania", countrybox_diameter);

    // Set a text scale factor
    textScaleFactor = d3.scaleLinear()
        .domain([300, 900]) // expected limits of SVG width
        .range([1, 1.5]); // when SVG is 1/2 width, text will be 2/3 size
    
    lilTextScaleFactor = d3.scaleLinear()
        .domain([300, 900]) // expected limits of SVG width
        .range([0.6, 1.5]); // when SVG is 1/2 width, text will be 2/3 size

    // Add captions to the continent boxes
    let makeCaption = (svg, continent) => svg.append("text")
        .attr("x", countrybox_diameter / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("font-size", 18)
        .attr("fill", "#f3eee0")
        .text(continent);

    as_caption = makeCaption(as_svg, "Asia");
    af_caption = makeCaption(af_svg, "Africa");
    eu_caption = makeCaption(eu_svg, "Europe");
    na_caption = makeCaption(na_svg, "North America");
    sa_caption = makeCaption(sa_svg, "South America");
    oc_caption = makeCaption(oc_svg, "Oceania");

    // Set up the hierarchies for the packing function
    root = hierarchy(languages, lang => lang);
    vul_root = hierarchy(languages, lang => lang.danger == "Vulnerable");
    def_root = hierarchy(languages, lang => lang.danger == "Definitely endangered");
    sev_root = hierarchy(languages, lang => lang.danger == "Severely endangered");
    cri_root = hierarchy(languages, lang => lang.danger == "Critically endangered");
    as_root = hierarchy(languages, lang => lang.continents.includes("AS"));
    af_root = hierarchy(languages, lang => lang.continents.includes("AF"));
    eu_root = hierarchy(languages, lang => lang.continents.includes("EU"));
    na_root = hierarchy(languages, lang => lang.continents.includes("NA"));
    sa_root = hierarchy(languages, lang => lang.continents.includes("SA"));
    oc_root = hierarchy(languages, lang => lang.continents.includes("OC"));

    // This plots a group for each circle,  through a normal D3 data join
    node = group(big_svg, root, big_pack);
    vul_node = group(vul_svg, vul_root, boxsingle_pack);
    def_node = group(def_svg, def_root, boxsingle_pack);
    sev_node = group(sev_svg, sev_root, boxsingle_pack);
    cri_node = group(cri_svg, cri_root, boxsingle_pack);
    as_node = group(as_svg, as_root, countrybox_pack);
    af_node = group(af_svg, af_root, countrybox_pack);
    eu_node = group(eu_svg, eu_root, countrybox_pack);
    na_node = group(na_svg, na_root, countrybox_pack);
    sa_node = group(sa_svg, sa_root, countrybox_pack);
    oc_node = group(oc_svg, oc_root, countrybox_pack);

    // Add circles and titles to each group
    circles = fill(node, colourPicker);
    vul_circles = fill(vul_node, "#619d94");
    def_circles = fill(def_node, "#ff8f78");
    sev_circles = fill(sev_node, "#fc4952");
    cri_circles = fill(cri_node, "#983d52");
    as_circles = fill(as_node, colourPicker);
    af_circles = fill(af_node, colourPicker);
    eu_circles = fill(eu_node, colourPicker);
    na_circles = fill(na_node, colourPicker);
    sa_circles = fill(sa_node, colourPicker);
    oc_circles = fill(oc_node, colourPicker);

    // Define the width and height of the scale
    scaleWidth = parseInt(d3.select('#mainwidth').style('width'), 10);
    scaleHeight = 200;

    // Create an SVG to put it in
    scale_svg = d3.select("#scale")
        .append("svg")
        .attr("width", scaleWidth)
        .attr("height", scaleHeight);

    // Pick the numbers that'll go into it
    scale_numbers = [10000, 50000, 100000, 500000, 1000000, 5000000];

    // Add the circles
    scale_circles = scale_svg.selectAll("scale_circle")
        .data(scale_numbers)
        .enter().append("circle")
        .attr("r", (d) => Math.sqrt(d * diameter / 3000000))
        .attr("cx", (d, i) => (i * scaleWidth / 7) + scaleWidth / 9)
        .attr("cy", scaleHeight / 3)
        .attr("stroke", "#f3eee0")
        .attr("fill", "none");

    // Add the text
    scale_text = scale_svg.selectAll("scaleText")
        .data(scale_numbers)
        .enter().append("text")
        .attr("x", (d, i) => (i * scaleWidth / 7) + scaleWidth / 9)
        .attr("y", scaleHeight * 4 / 5)
        .attr("text-anchor", "middle")
        .attr("fill", "#f3eee0")
        .attr("font-size", 12)
        .text((d) => format(d));

    // Big caption text size @ 900px width
    bigSize = 150;
    lilSize = 20;

    // Add caption to big circle last so it's on top
    makeBigCap = big_svg.append("text")
        .classed("cap", true)
        .attr("x", diameter / 2)
        .attr("y", diameter / 2)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .attr("font-size", textScaleFactor(diameter) * bigSize)
        .attr("font-weight", "bold")
        .attr("fill", "#f3eee0")
        .text("2469");
        
    makeLilCap = big_svg.append("text")
        .classed("cap", true)
        .attr("x", diameter / 2)
        .attr("y", ((diameter / 2) + (textScaleFactor(diameter) * bigSize)/2 + 10))
        .attr("text-anchor", "middle")
        .attr("font-size", lilTextScaleFactor(diameter) * lilSize)
        .attr("font-weight", "bold")
        .attr("fill", "#f3eee0")
        .text("languages are at risk of extinction around the world");

}

function circleUpdate() {
    // Get new width and height
    diameter = parseInt(d3.select('#bigcircle').style('width'), 10);
    boxsingle_diameter = parseInt(d3.select('.box-single').style('width'), 10);
    countrybox_diameter = parseInt(d3.select('.box').style('width'), 10);

    scaleWidth = parseInt(d3.select('#mainwidth').style('width'), 10);
    scale_svg.attr("width", scaleWidth);
    scale_circles.attr("cx", (d, i) => (i * scaleWidth / 7) + scaleWidth / 9);
    scale_text.attr("x", (d, i) => (i * scaleWidth / 7) + scaleWidth / 9);

    // Redraw the SVGs
    redrawSVG(big_svg, diameter);
    redrawSVG(vul_svg, boxsingle_diameter);
    redrawSVG(def_svg, boxsingle_diameter);
    redrawSVG(sev_svg, boxsingle_diameter);
    redrawSVG(cri_svg, boxsingle_diameter);
    redrawSVG(as_svg, countrybox_diameter);
    redrawSVG(af_svg, countrybox_diameter);
    redrawSVG(eu_svg, countrybox_diameter);
    redrawSVG(na_svg, countrybox_diameter);
    redrawSVG(sa_svg, countrybox_diameter);
    redrawSVG(oc_svg, countrybox_diameter);

    // Redefine the packing functions
    big_pack = pack(diameter);
    boxsingle_pack = pack(boxsingle_diameter);
    countrybox_pack = pack(countrybox_diameter);

    // Move the dots    
    moveDots(node, root, big_pack);
    moveDots(vul_node, vul_root, boxsingle_pack);
    moveDots(def_node, def_root, boxsingle_pack);
    moveDots(sev_node, sev_root, boxsingle_pack);
    moveDots(cri_node, cri_root, boxsingle_pack);
    moveDots(as_node, as_root, countrybox_pack);
    moveDots(af_node, af_root, countrybox_pack);
    moveDots(eu_node, eu_root, countrybox_pack);
    moveDots(na_node, na_root, countrybox_pack);
    moveDots(sa_node, sa_root, countrybox_pack);
    moveDots(oc_node, oc_root, countrybox_pack);

    // Resize the circles
    resize(circles);
    resize(vul_circles);
    resize(def_circles);
    resize(sev_circles);
    resize(vul_circles);
    resize(as_circles);
    resize(af_circles);
    resize(eu_circles);
    resize(na_circles);
    resize(sa_circles);
    resize(oc_circles);

    makeBigCap.attr("x", diameter / 2)
        .attr("y", diameter / 2)
        .attr("font-size", textScaleFactor(diameter) * bigSize);

    makeLilCap.attr("x", diameter / 2)
        .attr("y", ((diameter / 2) + (textScaleFactor(diameter) * bigSize)/2 + 10))
        .attr("font-size", lilTextScaleFactor(diameter) * lilSize);
}

// Load the data
d3.csv("data/languages_name.csv",
    cleanData,
    function (error, languages) {
        if (error) throw error;

        initialise(languages);

        // Listen for resize and update
        window.addEventListener("resize", circleUpdate);

    });
