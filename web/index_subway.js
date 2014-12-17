//load neightborhoods, subways, and streets

$(function() {
	// Window has loaded
	queue()
		.defer(d3.json,"restaurants_2.json")
		.defer(d3.json,"userLocations_clean1.json")
		.defer(d3.json, "geojson/cambridge_streets.geojson")
		//.defer(d3.json, "geojson/neighborhoods.geojson")
		.defer(d3.json, "geojson/boston_streets.geojson")
		.defer(d3.json, "geojson/somerville_streets.geojson")
		.defer(d3.csv,"subway_split/Back Bay Station.csv")
		.defer(d3.json, "geojson/subway_arcs.geojson")
		//.defer(d3.json, "geojson/blockgroups.geojson")
		.defer(d3.json, "geojson/brookline_streets.geojson")
		.defer(d3.csv,"crunchbase_addnosize.csv")
	
		//.defer(d3.json, "geojson/boston_streets_simplified1.geojson")
		//.defer(d3.json, "geojson/boston_streets_simplified4.geojson")
		//.defer(d3.json, "geojson/boston_streets_simplified3.geojson")
	
		.await(dataDidLoad);
})

function dataDidLoad(error,restaurantList,userLocations,cambridge,bostonStreets,somervilleStreets,reviews,subwayLines,brooklineStreets,crunchbase) {
	//console.log(line)	
	//console.log(stops)
	//console.log(userLocations)
	var width = 1400;
	var height = 900;
	var center = [ -71.095,42.342]
	var scale = 500000
	var translate = [width/2,height/2]
		
	var projection = d3.geo.mercator()
		.scale(scale)
		.center(center)
		.translate(translate)
	
	var svg = d3.select("#map")
			.append("svg")
			.attr("width",width)
			.attr("height",height)
	var ratingsChart = d3.select("#charts")
			.append("svg")
			.attr("width",400)
			.attr("height",400)	
	var userLocationsChart = d3.select("#userLocations")
			.append("svg")
			.attr("width",400)
			.attr("height",400)	
	drawStreets(cambridge,svg,width,height,projection, "cambridge", "#444",.3)
	drawStreets(bostonStreets,svg,width,height,projection,"bostonStreets","#444",.3)
	drawStreets(somervilleStreets,svg,width,height,projection,"somervilleStreets", "#444",.3)
	drawStreets(brooklineStreets,svg,width,height,projection,"brooklineStreets", "#444",.3)
		var subwayShow = false
		
		if(subwayShow == true){
			drawSubway(subwayLines,svg,width,height,projection,"subwayLines", "#000",4)
		}else{
			d3.selectAll("#map .subwayLines").remove()
		}
	var userLocationsChart = d3.select("#distanceChart")
			.append("svg")
			.attr("width",600)
			.attr("height",800)		
	//inOutOfState(reviews,userLocations,restaurantList,userLocationsChart)	
	
	//distanceScatterPlot(reviews,userLocations,restaurantList,userLocationsChart)
	//drawStreets(tracts,svg,width,height,projection,"tracts", "blue")
	//drawStreets(simplified_boston,svg,width,height,projection,"simplified","#444")
	//drawStreets(simplified_boston3,svg,width,height,projection,"simplified2","#444")
	//console.log(restaurantList)
	//drawRestaurants(restaurantList,reviews,svg,width,height)
	//drawScatterPlot(restaurantList)
	//reviewsByRestaurant(reviews,restaurant)
	//drawByFriends(reviews,"userLocation")
	drawMap(reviews,restaurantList,svg,"all", center, scale, translate)
	
		var colors = ["#CC7E33","#6ADC4E","#47CB96","#C7DE3D","#6AA341","#C4A62D","#E55B2F"]
	//drawByFriends(reviews,"reviewCount")
			var sectors = ["biotech","web","software","advertising","enterprise","public_relations","finance","enterprise","social","mobile","other","education","travel","games_video","security","analytics","local","advertising","network_hosting","search","consulting","sports"]
			for (var sector in sectors){
				console.log(sectors[sector])
				//drawCompanies(crunchbase,svg, sectors[sector], center, scale, translate, sectors[sector], "#6ADC4E")
				
			}
		
//	drawCompanies(crunchbase,svg, "enterprise", center, scale, translate, "enterprise", "#C4A62D")
//	drawCompanies(crunchbase,svg, "finance", center, scale, translate, "finance", "#C4A62D")
//	drawCompanies(crunchbase,svg, "consulting", center, scale, translate, "consulting", "#C4A62D")
//	drawCompanies(crunchbase,svg, "public_relations", center, scale, translate, "public_relations", "#C4A62D")
				
			
	//drawCompanies(crunchbase,svg, "software", center, scale, translate, "software", "#6AA341")
	//drawCompanies(crunchbase,svg, "mobile", center, scale, translate, "mobile", "#6AA341")
	//drawCompanies(crunchbase,svg, "web", center, scale, translate, "web", "#6AA341")
	//drawCompanies(crunchbase,svg, "social", center, scale, translate, "social", "#6AA341")
	
	//drawByRating(reviews,restaurantList,ratingsChart)
	drawTimeline(reviews,restaurantList)
	
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
function drawTimeline(data, restaurants){
	var width = 1400
	var height = 100
	var margin = 20
	var timelineData = table.group(data,["date"])
	var mostFrequent = table.maxCount(timelineData).count
	//console.log(mostFrequent)
	var dateFormat = d3.time.format("%Y-%m-%d")
	var dateFrequency = []
	for (var date in timelineData){
		dateFrequency.push([dateFormat.parse(date),timelineData[date].length])
	}
	var startDate = new Date((dateFormat.parse("2004-01-01")))
	var endDate = new Date((dateFormat.parse("2014-12-01")))
	var dateScale = d3.time.scale().domain([startDate,endDate]).rangeRound([margin, width-margin])
	var yScale = d3.scale.linear().domain([0,mostFrequent]).range([0,height-margin])
	var timeline = d3.select("#timeline").append("svg").attr("width", width).attr("height",height-margin)
	var xAxis = d3.svg.axis().scale(dateScale).ticks(10).orient("bottom")
	timeline.selectAll("rect")
		.data(dateFrequency)
		.enter()
		.append("rect")
		.attr("x", function(d,i){
			return dateScale(d[0])
		})
		.attr("y", function(d){return height- yScale(d[1])-margin
		})
		.attr("height", function(d){
			return yScale(d[1])
		})
		.attr("width", function(d){
			return 1
		})
		.style("fill", "#444")
		.attr("opacity", 0.5)
		.on("mouseover",function(d,i){
			//console.log(d)
			d3.select(this).attr("opacity",1)
			var currentDate = d[0]
				var currentMonth = currentDate.getMonth()+1
				var currentDay = currentDate.getDay()+1
				var currentYear = currentDate.getFullYear()
				if (String(currentMonth).length ==1){
					currentMonth = "0"+String(currentMonth)
				}
				if (String(currentDay).length ==1){
					currentDay = "0"+String(currentDay)
				}
				var formatedDate = currentYear+"-"+currentMonth+"-"+currentDay
			//var currentData = filterData(data,"date",formatedDate)
			//console.log(d)
			//get current date to mouse
			//get number of mouse date for before mouse		
			var currentData	= table.filter(table.group(data, ["date"]), function(list, date) {
				//year = currentYear 
				var currentX = dateScale(d[0])
				//console.log(date, new Date((dateFormat.parse(date))))
				return (dateScale(new Date((dateFormat.parse(date)))) <= currentX)
			})	
			//console.log(currentData.length)	
			d3.selectAll("#map svg circle").remove()
			var svg = d3.select("#map svg")
			drawMap(currentData,restaurants,svg,currentDate)
				
			d3.selectAll("#charts svg rect").remove()
			d3.selectAll("#charts svg text").remove()
			var ratingsChartSvg = d3.select("#charts svg")
			//drawByRating(currentData,restaurants,ratingsChartSvg)
				
			d3.selectAll("#userLocations svg rect").remove()
			var ratingsChartSvg = d3.select("#userLocations svg")
			//inOutOfState(data,locations,restaurants,svg)
		})
		.on("mouseout", function(){d3.select(this).attr("opacity",.5)})
		
   timeline.append("g")
        .attr("class", "x axis")
        //.attr("transform", "translate(0," + height-10 + ")")
        .call(xAxis);
}
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}
function distanceScatterPlot(data, locations,restaurants,svg){
	var restaurantsByStars = table.group(data, ["distance"])
	var mostFrequent = table.maxCount(restaurantsByStars).count
	var lineHeight = 10
	var distanceScale = d3.scale.linear().domain([0,7000]).range([0,400])
	var freqScale = d3.scale.linear().domain([0,mostFrequent]).range([0,50])
		var data = jsonToArray(restaurantsByStars)
	svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx",function(d){
			return distanceScale(parseFloat(d[0]))
		})
		.attr("cy",function(d){
			return 400-freqScale(parseFloat(d[1]))
		})
		.attr("height",function(d){return freqScale(parseFloat(d[1]))})
		.attr("width", function(d){return distanceScale(1)})
}
function inOutOfState(data,locations,restaurants,svg){
	var userLocations = table.group(data, ["userLocation"])
	var mostFrequent = table.maxCount(userLocations)
	//console.log(mostFrequent)
	var userLocationArray = jsonToArray(userLocations)
	//console.log(userLocationArray)
		var sum = 121079
	userLocationArray.sort(function(a,b){
	    return b[1]-a[1];
	});
	var topLocations = userLocationArray.slice(0, 30)
	var lineHeight = 14
	var frequencyScale = d3.scale.linear().domain([0,35000]).range([0,400])	
	svg.selectAll("rect")
		.data(topLocations)
		.enter()
		.append("rect")
		.attr("y",function(d,i){return i*lineHeight+20})
		.attr("x",function(d){return 2})
		.attr("width",function(d){return frequencyScale(parseFloat(d[1]))})
		.attr("height", function(d){return lineHeight-2})
		.style("fill", function(d){
			return "#aaa"
		})
		.on("click", function(d){
			var currentRating = d[0]
			var currentData = filterData(data,"userLocation",currentRating)
			d3.selectAll("#map svg circle").remove()
			var svg = d3.select("#map svg")
			drawMap(currentData,restaurants,svg,currentRating)
			svg.selectAll("rect").style("fill", "#aaa")
			d3.select(this).style("fill", "#444")
			//console.log(currentData)
			d3.selectAll("#timeline svg").remove()
			drawTimeline(currentData, restaurants)
		})
	svg.selectAll("text")
		.data(topLocations)
		.enter()
		.append("text")
		.attr("font-size",10)
		.attr("x",function(d){return frequencyScale(parseFloat(d[1]))+8})
		.attr("y",function(d,i){return i*lineHeight+30})
		.attr("text-anchor","left")
		//.text(function(d){return d[0]+" : "+d[1]+", "+parseInt(d[1]/sum*100)+"%"})
		.text(function(d){return d[0]+" : "+d[1]})
		.style("fill", "#000")
			
	svg.append("text")
			.text("Location | # Reviews")
			.attr("x",0)
			.attr("y",12)
}
function filterData(data,field,filter){
	//console.log("filter" + field)
	output = table.filter(table.group(data,[field]), function(list, rating){
		return(rating == filter)
	})
	return output
	//console.log(output)
}
function drawRestaurantChart(data,restaurant){
	var filter = restaurant;
	var field = "restaurant";
	var data = data;
	var restaurantData = filterData(data,field,filter)
	//var restaurantDataByDate = table.group(restaurantData,"date")
	//console.log(restaurantDataByDate)
	
	var restaurantChart = d3.select("#chart-title").append("svg")
	var restaurantDataArray = jsonToArray(restaurantData)
		
	restaurantChart.selectAll("rect")
		.data(restaurantDataArray)
		.enter()
		.append("rect")
		.attr("x", function(d){
			console.log(d)
			return 20		
		})
		.attr("y", function(d){
			return 20		
		})
		.attr("width",function(d){
			return 20		
		})
		.attr("height",function(d){
			return 20		
		})
		.attr("fill", "#aaa")
}
function drawCompanies(data,svg, className, center, scale, translate, sector, color){
	var restaurantsByName= filterData(data,"sector",sector)
	var mostFrequent = table.maxCount(restaurantsByName)
	//console.log(restaurantsByName)
	restaurantLocations = []
	for(var i in restaurantsByName){
		restaurantLocations.push([restaurantsByName[i].sector,restaurantsByName[i].company,restaurantsByName[i].employees,restaurantsByName[i].lat,restaurantsByName[i].lng])
	}
	var width = 1400;
	var height = 900;
	var projection = d3.geo.mercator()
		.scale([500000])
		.center([ -71.095,42.342])
		.translate([width/2,height/2])
		
	var reviewScale = d3.scale.linear()
		.domain([1,500])
		.range([2,10])

	var ratingScale = d3.scale.pow()
		.domain([2,4])
		.range(["#0000ff","#ff0000"])
	var sector = "photo_video"
	svg.selectAll("circle companies")
		.data(restaurantLocations)
		.enter()
		.append("circle")
		.attr("cx", function(d){
			return projection([parseFloat(d[4]),parseFloat(d[3])])[0]
		})
		.attr("cy", function(d){
			return projection([parseFloat(d[4]),parseFloat(d[3])])[1]
		})
		.attr("r", function(d){
			//return 3
				return reviewScale(parseFloat(d[2]))
		})
        .style("fill", function(d){
				return "none"
		})
		.style("stroke",function(d){
				return "#000"
		})
		.attr("opacity",.6)
		.attr("class", className)
		.on("mouseover", function(d){console.log(d)})
}
function drawMap(data,restaurants,svg, className, center, scale, translate){
	//console.log(restaurants)
	var restaurantsByName= table.group(data, ["restaurant"])
	var mostFrequent = table.maxCount(restaurantsByName)
	restaurantLocations = []
	for(var i in restaurantsByName){
		if(restaurants[i] != undefined){
		restaurantLocations.push([i,restaurantsByName[i].length,parseFloat(restaurants[i].rating),parseFloat(restaurants[i].lat),parseFloat(restaurants[i].lng)])		
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
		.range([2,50])

	var ratingScale = d3.scale.pow()
		.domain([2,4])
		.range(["#0000ff","#ff0000"])

	svg.selectAll("circle")
		.data(restaurantLocations)
		.enter()
		.append("circle")
		.attr("cx", function(d){
			return projection([parseFloat(d[4]),parseFloat(d[3])])[0]
		})
		.attr("cy", function(d){
			return projection([parseFloat(d[4]),parseFloat(d[3])])[1]
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
			   //console.log(d)
			   //return ratingScale(d[2])
				return "black"
			})
		.attr("opacity",.2)
		.attr("class", className)
		svg.selectAll("circle")
			.on("mouseover", function(d){
			//	console.log(d)
				d3.selectAll("#timeline svg").remove()
				var currentRestaurantData = filterData(data,"restaurant",d[0])
				drawTimeline(currentRestaurantData, restaurants)
			//d3.select("#chart-title").html(d[0]+"</br>"+d[1]+" reviews")
			//var restaurant = d[0]
		//	drawRestaurantChart(data,restaurant)
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
function jsonToArrayNotLength(object){
	var array = $.map(object, function(value,index){
		return [[index,value]]
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


function drawByRating(data,restaurants, svg){
	
	var restaurantsByStars = table.group(data, ["stars"])
	var mostFrequent = table.maxCount(restaurantsByStars)
		var ratings = [["1.0",restaurantsByStars["1.0"].length],
		["2.0",restaurantsByStars["2.0"].length],
		["3.0",restaurantsByStars["3.0"].length],
		["4.0",restaurantsByStars["4.0"].length],
		["5.0",restaurantsByStars["5.0"].length]]
	var ratingsScale = d3.scale.linear().domain([0,46000]).range([10,400])
	var sum = restaurantsByStars["1.0"].length+restaurantsByStars["2.0"].length+restaurantsByStars["3.0"].length+restaurantsByStars["4.0"].length+restaurantsByStars["5.0"].length
	var lineHeight =20;
	var ratingScale = d3.scale.pow()
		.domain([0,5])
		.range(["#0000ff","#ff0000"])		
	svg.selectAll("rect")
			.data(ratings)
			.enter()
			.append("rect")
			.attr("y",function(d){return parseFloat(d[0])*lineHeight})
			.attr("x",function(d){return 30})
			.attr("width",function(d){return ratingsScale(parseFloat(d[1]))})
			.attr("height", function(d){return lineHeight-2})
			.style("fill", function(d){
				return ratingScale(parseFloat(d[0]))
			})
			.attr("opacity",.5)
			.on("click", function(d){
				d3.selectAll("#charts svg rect").attr("opacity", .5)
				d3.select(this).attr("opacity",1)
				var currentRating = d[0]
				var currentData = filterData(data,"stars",currentRating)
				d3.selectAll("#map svg circle").remove()
				var svg = d3.select("#map svg")
				drawMap(currentData,restaurants,svg,currentRating)
				d3.selectAll("#timeline svg").remove()
				var currentRestaurantData = filterData(data,"stars",d[0])
				drawTimeline(currentRestaurantData, restaurants)
			})

	svg.selectAll("text")
		.data(ratings)
		.enter()
		.append("text")
		.attr("x",2)
		.attr("y",function(d){return parseFloat(d[0])*lineHeight+16})
		.attr("text-anchor","left")
		.text(function(d){return d[0]+" : "+d[1]+", "+parseInt(d[1]/sum*100)+"%"})
		.style("fill", "#000")
			
	svg.append("text")
			.text("Stars | # Reviews")
			.attr("x",0)
			.attr("y",12)
}

function drawStreets(streets,svg,width,height,projection,className,color,lineWeight){
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
		.attr("opacity", .3)
		.style("fill", "none")
        .style("stroke-width", lineWeight)
        .style("stroke", function(d){
		return color})	
}

function drawSubway(streets,svg,width,height,projection,className,color,lineWeight){
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
		.attr("opacity", .3)
		.style("fill", "none")
        .style("stroke-width", lineWeight)
        .style("stroke", function(d){
			//console.log(d)
			return d.properties.LINE
		return color})	
}