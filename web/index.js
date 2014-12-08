//load neightborhoods, subways, and streets

$(function() {
	// Window has loaded
	queue()
		.defer(d3.csv,"restaurants.csv")
		.defer(d3.json, "cambridge_roads.geojson")
		.defer(d3.json, "neighborhoods.geojson")
		.defer(d3.json, "boston_streets.geojson")
		.defer(d3.json, "somerville_streets.geojson")
		.defer(d3.json,"noreviewcontent.json")
		.await(dataDidLoad);
})

function dataDidLoad(error,restaurantList,cambridge,boston,bostonStreets,somervilleStreets,reviews) {
	//console.log(line)	
	//console.log(stops)
	var width = 800;
	var height = 800;
	var projection = d3.geo.mercator()
		.scale([450000])
		.center([ -71.085,42.341])
		.translate([width/2,height/2])
	
	var svg = d3.select("#map")
			.append("svg")
			.attr("width",width)
			.attr("height",height);
	drawStreets(cambridge,svg,width,height,projection, "cambridge")
	drawStreets(boston,svg,width,height,projection,"boston")
	drawStreets(bostonStreets,svg,width,height,projection,"bostonStreets")
	drawStreets(somervilleStreets,svg,width,height,projection,"somervilleStreets")
	
	drawRestaurants(restaurantList,reviews,svg,width,height)
	drawScatterPlot(restaurantList)
	
	reviewsByRestaurant(reviews,restaurant)
}


function drawScatterPlot(data){
	var data = data;
	//var width = 600;
	//var height = 800;
	var reviewScale = d3.scale.linear()
		.domain([1,2000])
		.range([1,30])
	
	var ratingScale = d3.scale.linear()
		.domain([2,4])
		.range(["#0000ff","#ff0000"])
	var margin = {top: 40, right: 50, bottom: 30, left: 40},
	    width = 400; - margin.left - margin.right,
	    height = 400 - margin.top - margin.bottom;
	var scatterPlot = d3.select("#charts")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	data.forEach(function(d) {
	    d.reviewCount = +d.reviewCount;
		d.ratingCount = +d.ratingCount;
		//    console.log(d);
	  });				
var xValue = function(d) { return d.ratingCount;}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return d.reviewCount;}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

// x-axis
  scatterPlot.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Stars");

  // y-axis
  scatterPlot.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of Reviews");
	  
 scatterPlot.selectAll(".dot")
      .data(data)
      .enter()
	  .append("circle")
      .attr("class", "dot")
      .attr("r", function(d){
		  return reviewScale(d.reviewCount)
	  })
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d){
		return ratingScale(d.ratingCount)
	  })
      .style("opacity",0.1)
	  .on("mouseover", function(d){console.log(d)})
}


function reviewsByRestaurant(data,restaurant){
	var data = data[restaurant]
	//console.log(data[0])
		console.log(data.length)
		for(var i =0; i< data.length; i++){
			//console.log(data[i])
			rating = data[i][5]
			
		}
	
}
function drawRestaurants(data,reviews, svg, width,height,projection){
	var width = width;
	var height = height;
	var projection = d3.geo.mercator()
		.scale([450000])
		.center([ -71.085,42.341])
		.translate([width/2,height/2])
	var reviewScale = d3.scale.linear()
		.domain([1,2000])
		.range([1,30])
	
	var ratingScale = d3.scale.linear()
		.domain([2,4])
		.range(["#0000ff","#ff0000"])
		
	svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function(d){
			return projection([parseFloat(d.lng),parseFloat(d.lat)])[0]
		})
		.attr("cy", function(d){
			return projection([parseFloat(d.lng),parseFloat(d.lat)])[1]
		})
		.attr("r", function(d){
			if(isNaN(parseFloat(d.reviewCount))){
				return 0
			}
			else{
			return reviewScale(parseFloat(d.reviewCount))				
			}
		})
        .style("fill", function(d){
			return ratingScale(d.ratingCount)
		})
		.attr("opacity", 0.2)
		.on("mouseover", function(d){
			d3.select("#chart-title").html(d.name+"</br>"+d.reviewCount+" Reviews</br>"+d.ratingCount+" Stars</br>"+d.address)
			reviewsByRestaurant(reviews,d.link)
		})
}


function drawStreets(streets,svg,width,height,projection,className){
	var width = width;
	var height = height;
	var projection = projection;	
	var path = d3.geo.path()
		.projection(projection)
	var className = className
	var tip = d3.tip().attr('class', 'd3-tip').html(function(d){return d;});
		
	svg.selectAll("path " + className)
        .data(streets.features)
        .enter()
        .append("path")
		.attr("d",path)
		.attr("opacity", 0.2)
		.style("fill", "none")
        .style("stroke-width", .5)
        .style("stroke", function(d){
		return "#000"})	
}
