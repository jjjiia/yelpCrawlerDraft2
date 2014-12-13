//load neightborhoods, subways, and streets

$(function() {
	// Window has loaded
	queue()
		.defer(d3.json,"restaurants.json")
		.defer(d3.json, "geojson/cambridge_roads.geojson")
		.defer(d3.json, "geojson/neighborhoods.geojson")
		.defer(d3.json, "geojson/boston_streets.geojson")
		.defer(d3.json, "geojson/somerville_streets.geojson")
		.defer(d3.csv,"allReviews_cleaning_stage9.csv")
		.defer(d3.json, "geojson/subway_arcs.geojson")
		.defer(d3.json, "geojson/tracts.geojson")
		.defer(d3.json, "geojson/blockgroups.geojson")
		.defer(d3.json, "geojson/brookline_streets.geojson")
	
		//.defer(d3.json, "geojson/boston_streets_simplified1.geojson")
		//.defer(d3.json, "geojson/boston_streets_simplified4.geojson")
		//.defer(d3.json, "geojson/boston_streets_simplified3.geojson")
	
		.await(dataDidLoad);
})

function dataDidLoad(error,restaurantList,cambridge,boston,bostonStreets,somervilleStreets,reviews,subwayLines,tracts,blockgroups,brooklineStreets) {
	//console.log(line)	
	//console.log(stops)
	var width = 1400;
	var height = 900;
	var projection = d3.geo.mercator()
		.scale([500000])
		.center([ -71.095,42.342])
		.translate([width/2,height/2])
	
	var svg = d3.select("#map")
			.append("svg")
			.attr("width",width)
			.attr("height",height)
	//drawStreets(cambridge,svg,width,height,projection, "cambridge", "green")
	//drawStreets(bostonStreets,svg,width,height,projection,"bostonStreets","#444")
	//drawStreets(somervilleStreets,svg,width,height,projection,"somervilleStreets", "red")
	//drawStreets(brooklineStreets,svg,width,height,projection,"brooklineStreets", "red")
	
	//drawStreets(boston,svg,width,height,projection,"boston", "green")
	//drawStreets(subwayLines,svg,width,height,projection,"subwayLines", "red")
	//drawStreets(tracts,svg,width,height,projection,"tracts", "blue")
	//drawStreets(simplified_boston,svg,width,height,projection,"simplified","#444")
	//drawStreets(simplified_boston3,svg,width,height,projection,"simplified2","#444")
	//console.log(restaurantList)
	//drawRestaurants(restaurantList,reviews,svg,width,height)
	//drawScatterPlot(restaurantList)
	//reviewsByRestaurant(reviews,restaurant)
	//drawByFriends(reviews,"userLocation")
	
	//drawByFriends(reviews,"reviewCount")
	drawMap(reviews,restaurantList,svg,"all")
	
	drawByRating(reviews,restaurantList)
	drawTimeline(reviews)
	
	filterData(reviews,"stars","4.0")
}
var table = {
	group: function(rows, fields) {
		var view = {}
		var pointer = null

		for(var i in rows) {
			var row = rows[i]

			pointer = view
			for(var j = 0; j < fields.length; j++) {
				var field = fields[j]

				if(!pointer[row[field]]) {
					if(j == fields.length - 1) {
						pointer[row[field]] = []
					} else {
						pointer[row[field]] = {}
					}
				}

				pointer = pointer[row[field]]
			}

			pointer.push(row)
		}

		return view
	},

	maxCount: function(view) {
		var largestName = null
		var largestCount = null

		for(var i in view) {
			var list = view[i]

			if(!largestName) {
				largestName = i
				largestCount = list.length
			} else {
				if(list.length > largestCount) {
					largestName = i
					largestCount = list.length
				}
			}
		}

		return {
			name: largestName,
			count: largestCount
		}
	},

	filter: function(view, callback) {
		var data = []

		for(var i in view) {
			var list = view[i]
			if(callback(list, i)) {
				data = data.concat(list)
			}
		}
		return data
	}
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
	
	//console.log(data)
	svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function(d){
			console.log(d[0])
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
function drawTimeline(data){
	var timelineData = table.group(data,["date"])
	var mostFrequent = table.maxCount(timelineData)
	var dateFormat = d3.time.format("%Y-%m-%d")
	var dateFrequency = []
	for (var date in timelineData){
		dateFrequency.push([dateFormat.parse(date),timelineData[date].length])
	}
	var startDate = new Date((dateFormat.parse("2004-01-01")))
	var endDate = new Date((dateFormat.parse("2014-12-01")))
	var dateScale = d3.time.scale().domain([startDate,endDate]).rangeRound([0, 900])
	var height = 200
	var yScale = d3.scale.linear().domain([0,5000]).range([0,height])
	var timeline = d3.select("#timeline").append("svg").attr("width", 900).attr("height",200)		
	timeline.selectAll("rect")
		.data(dateFrequency)
		.enter()
		.append("rect")
		.attr("x", function(d,i){
			return dateScale(d[0])
		})
		.attr("y", function(d){return height-d[1]
		})
		.attr("height", function(d){
			return d[1]
		})
		.attr("width", function(d){
			return 1
		})
		.style("fill", "#aaaaaa")
		.on("mouseover",function(d,i){
			//console.log(d)
		})
}
function filterData(data,field,filter){
	console.log("filter")
	output = table.filter(table.group(data,[field]), function(list, rating){
		return(rating == filter)
	})
	return output
	//console.log(output)
}
function drawMap(data,restaurants,svg, className){
	console.log(data)
	var restaurantsByName= table.group(data, ["restaurant"])
	var mostFrequent = table.maxCount(restaurantsByName)
	restaurantLocations = []
	for(var i in restaurantsByName){
		if(restaurants[i] != undefined){
		restaurantLocations.push([i,restaurantsByName[i].length,parseFloat(restaurants[i].lat),parseFloat(restaurants[i].lng)])				
		}
	}
	var width = 1400;
	var height = 900;
	var projection = d3.geo.mercator()
		.scale([500000])
		.center([ -71.095,42.342])
		.translate([width/2,height/2])
		
	var reviewScale = d3.scale.linear()
		.domain([1,2000])
		.range([5,50])

	var ratingScale = d3.scale.linear()
		.domain([2,4])
		.range(["#0000ff","#ff0000"])

	svg.selectAll("circle")
		.data(restaurantLocations)
		.enter()
		.append("circle")
		.attr("cx", function(d){
			return projection([parseFloat(d[3]),parseFloat(d[2])])[0]
		})
		.attr("cy", function(d){
			return projection([parseFloat(d[3]),parseFloat(d[2])])[1]
		})
		.attr("r", function(d){
			if(isNaN(parseFloat(d[1]))){
				return 0
			}
			else{
			return reviewScale(parseFloat(d[1]))				
			}
		})
        .style("fill", function(d){
				return "red"
			})
		.attr("opacity", 0.4)
		.attr("class", className)
		.on("mouseover", function(d){
			//d3.select("#chart-title").html(d.name+"</br>"+d.reviewCount+" Reviews</br>"+d.ratingCount+" Stars</br>"+d.address)
			//reviewsByRestaurant(reviews,d.link)
		})
//	svg.selectAll("circle")
//			.data(restaurantsByName)
//			.enter()
//			.append("rect")
//			.attr("y",function(d){return parseFloat(d[0])*20})
//			.attr("x",function(d){return 0})
//			.attr("width",function(d){return ratingsScale(parseFloat(d[1]))})
//			.attr("height", function(d){return 18})
//			.style("fill", "#aaaaaa")
}

function jsonToArray(object){
	var array = $.map(object, function(value,index){
		return [[index,value.length]]
	})
	//console.log(array)
	return array
}

function drawByFriends(data,field){
	var restaurantsByFriends = table.group(data, [field])
	var mostFrequent = table.maxCount(restaurantsByFriends)
	var friendsArray = jsonToArray(restaurantsByFriends)
	//for(var friendCount in restaurantsByFriends){
	//	console.log(friendCount, restaurantsByFriends[friendCount].length)
	//}
	var xScale = d3.scale.linear().domain([0,4000]).range([0,400])
	var yScale = d3.scale.sqrt().domain([0,mostFrequent.count]).range([0,200])
	var friendsGraph = d3.select("#friends").append("svg").attr("width", 400).attr("height", 400)
	friendsGraph.selectAll("rect")
		.data(friendsArray)
		.enter()
		.append("rect")
		.attr("x",function(d){return xScale(parseInt(d[0]))})
		.attr("y",function(d){return 200-yScale(parseInt(d[1]))})
		.attr("height", function(d){return yScale(parseInt(d[1]))})
		.attr("width", function (d){return 1})
		.style("fill", "#aaa")
}

function drawByRating(data,restaurants){
	var restaurantsByStars = table.group(data, ["stars"])
	var mostFrequent = table.maxCount(restaurantsByStars)
	var ratings = [["1.0",restaurantsByStars["1.0"].length],
		["2.0",restaurantsByStars["2.0"].length],
		["3.0",restaurantsByStars["3.0"].length],
		["4.0",restaurantsByStars["4.0"].length],
		["5.0",restaurantsByStars["5.0"].length]]
	var ratingsScale = d3.scale.linear().domain([0,mostFrequent.count]).range([10,400])
		//console.log(ratings)
	var ratingsChart = d3.select("#charts")
			.append("svg")
			.attr("width",400)
			.attr("height",400)
		
	ratingsChart.selectAll("rect")
			.data(ratings)
			.enter()
			.append("rect")
			.attr("y",function(d){return parseFloat(d[0])*20})
			.attr("x",function(d){return 0})
			.attr("width",function(d){return ratingsScale(parseFloat(d[1]))})
			.attr("height", function(d){return 18})
			.style("fill", "#000")
			.on("click", function(d){
				var currentRating = d[0]
				var currentData = filterData(data,"stars",currentRating)
				d3.selectAll("#map svg circle").remove()
				var svg = d3.select("#map svg")
				drawMap(currentData,restaurants,svg,currentRating)
			})
	ratingsChart.selectAll("text")
		.data(ratings)
		.enter()
		.append("text")
		.attr("x",2)
		.attr("y",function(d){return parseFloat(d[0])*20+14})
		.attr("text-anchor","left")
		.text(function(d){return d[0]+" stars: "+d[1]})
		.style("fill", "#fff")
}

function drawStreets(streets,svg,width,height,projection,className,color){
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
		.attr("opacity", .5)
		.style("fill", "none")
        .style("stroke-width", .5)
        .style("stroke", function(d){
		return color})	
}
