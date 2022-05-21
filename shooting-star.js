var svg = d3.select("#canvas");
var margin = {top: 20, right: 20, bottom: 30, left: 40}; // to memorize the margins
var width = 500 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;
var updateTime = 1000; // time for transitions
var nextStarConfigNumber = 1;   //used to change stars' configurations
var STAR_IMAGE = 'https://www.mariowiki.it/images/thumb/2/2f/Stella_NSMBU.png/1200px-Stella_NSMBU.png';
var imageSize = 40;

var svgHeightScale = d3.scaleLinear();
var svgWidthScale = d3.scaleLinear();

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function updateDrawing(){
    var stars = svg.selectAll(".star");

    switch(nextStarConfigNumber){
        case 1: 
            stars.transition().duration(updateTime)
                .attr("x", function(d) { return svgWidthScale(d.x1); })
                .attr("y", function(d) { return svgHeightScale(d.y1); });
                nextStarConfigNumber++;
            break;
        case 2:
            stars.transition().duration(updateTime)
                .attr("x", function(d) { return svgWidthScale(d.x2); })
                .attr("y", function(d) { return svgHeightScale(d.y2); });
                nextStarConfigNumber++;
            break;
        case 3:
            stars.transition().duration(updateTime)
                .attr("x", function(d) { return svgWidthScale(d.x3); })
                .attr("y", function(d) { return svgHeightScale(d.y3); });
                nextStarConfigNumber = 1;
            break;
        default:
            console.log("ERROR");
            break;
    }
}

function firstDrawing(data){
    var stars = svg.selectAll(".star").data(data);

    stars.enter()
        .append("image")
        .attr("class", "star")
        .attr('href', STAR_IMAGE)
        .attr("x", function(d) { return svgWidthScale(d.x1);})
        .attr("y", function(d) { return svgHeightScale(d.y1);})
        .attr("filter", function() {return "grayscale(" + getRandomInt(100) + "%) "
                                            + "hue-rotate(" + getRandomInt(360) + "deg)"
                                            + "saturate(" + getRandomInt(1000) + "%)";})
        .attr('width', 40)
        .attr('height', 40);
    nextStarConfigNumber++;
}

function setWidthScaleDomainAndRange(data){
    maxX1 = d3.max(data, function(d){return d.x1});
    maxX2 = d3.max(data, function(d){return d.x2});
    maxX3 = d3.max(data, function(d){return d.x3});

    minX1 = d3.min(data, function(d){return d.x1});
    minX2 = d3.min(data, function(d){return d.x2});
    minX3 = d3.min(data, function(d){return d.x3});
    svgWidthScale.domain([Math.min(minX1, minX2, minX3), Math.max(maxX1, maxX2, maxX3)])
    svgWidthScale.range([0, width - imageSize]);
}

function setHeightScaleDomainAndRange(data){
    maxY1 = d3.max(data, function(d){return d.y1});
    maxY2 = d3.max(data, function(d){return d.y2});
    maxY3 = d3.max(data, function(d){return d.y3});

    minY1 = d3.min(data, function(d){return d.y1});
    minY2 = d3.min(data, function(d){return d.y2});
    minY3 = d3.min(data, function(d){return d.y3});
    svgHeightScale.domain([Math.min(minY1, minY2, minY3), Math.max(maxY1, maxY2, maxY3)])
    svgHeightScale.range([0, height - imageSize]);
}

d3.json('stars.json')
    .then(function(data) {
        setWidthScaleDomainAndRange(data);
        setHeightScaleDomainAndRange(data);
        svg.attr("width", width).attr("height", height);
        firstDrawing(data);
    }
);

document.body.addEventListener("click", updateDrawing)

