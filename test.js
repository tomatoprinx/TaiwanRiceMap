var width = 800,
    height = 600;

var svg = d3.select("body").append("svg")
    // .attr("class", "svgback")
    .attr("width", width)
    .attr("height", height);
var projection = d3.geo.mercator()
    .center([121,24])
    .scale(6000);

var path = d3.geo.path()
    .projection(projection);


d3.json("county.json", function(error, topology) {
    var g = svg.append("g");
    
    // 縣市/行政區界線
    d3.select("svg").append("path").datum(
            topojson.mesh(topology,
                    topology.objects["county"], function(a,
                            b) {
                        return a !== b;
                    })).attr("d", path).attr("class","subunit-boundary");
    
    d3.select("g").selectAll("path")
          .data(topojson.feature(topology, topology.objects.county).features)
          .enter()
          .append("path")
          .attr("d", path)
          .attr({
                d : path,
                name : function(d) {
                    return d.properties["C_Name"];
                },
                fill : '#55AA00'
        });
});