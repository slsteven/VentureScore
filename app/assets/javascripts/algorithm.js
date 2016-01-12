//Creates search array based on user's category rankings
function create_search_array(){
	var myVals = [];
	var count = 1
	$( '.interest_text' ).each(function(){
	  	myVals.push({
	  		category: $(this).attr('name'),
	  		rank: count,
	  	});
	  	count ++;
	});
	return myVals
}

/*
Get results takes in the users rankings and the inputed location. The function will only take 
the top 5 ranked categories into consideration because of the googlemaps api query limits. To handle
asyncronous issues, there is a callback in each switch case that listens for the results array to reach 
a certain length before firing the getDistances function. 
*/
function getResults(ranking,current_location){
	var results = [];
	for (var i = 0;i<5/*ranking.length*/;i++){
		switch(ranking[i].category){
			case "food": 
				var searchObj = {
					query: "food restaurant",
					location:current_location,
					radius: 1000,
					types:["restaurant","bakery","cafe","food","meal_delivery"
					,"meal_takeaway"],
				}
				performSearch(searchObj,(i+1),"food",function(params){
					results.push(params);
					if(results.length == 5){
						getAllDistances(results,current_location);
					}
				})
				break;
			case "culture":
				var searchObj = {
					query: "museum art",
					location: current_location,
					radius: 1000,
					types:["museum","aquarium","art_gallery","library",],
				}
				performSearch(searchObj,(i+1),"culture",function(params){
					results.push(params);
					if(results.length == 5){
						getAllDistances(results,current_location);
					}
				})
				break;
			case "shopping":
				//block
				var searchObj = {
					query: "shopping",
					location: current_location,
					radius: 1000,
					types:["shopping_mall","car_dealer","convenience_store","clothing_store", "department_store", "shoe_store","jewelry_store"],
				}
				performSearch(searchObj,(i+1),"shopping", function(params){
					results.push(params);
					if(results.length == 5){
						getAllDistances(results,current_location);
					}
				})
				break;
			case "health":
				//block
				var searchObj = {
					query:"park gym health",
					location:current_location,
					radius: 1000,
					types:["park","gym","doctor","health","hospital","pharmacy"],
				}
				performSearch(searchObj,(i+1),"health",function(params){
					results.push(params);
					if(results.length == 5){
						getAllDistances(results,current_location);
					}
				})
				break;
			case "transportation":
				//block
				var searchObj = {
					query: "transportation ",
					location: current_location,
					radius: 1000,
					types:["bus_station","subway_station","train_station","airport","taxi_stand"],
				}
				performSearch(searchObj,(i+1),"transportation",function(params){
					results.push(params);
					if(results.length == 5){
						getAllDistances(results,current_location);
					}
				})
				break;
			case "nightlife":
				//block
				var searchObj = {
					query: "club bar",
					location:current_location,
					radius:1000,
					types:["night_club","bar","movie_theater"],
				}
				performSearch(searchObj,(i+1),"nightlife",function(params){
					results.push(params);
					if(results.length == 5){
						getAllDistances(results,current_location);
					}
				})
				break;
			case "faith":
				//block
				var searchObj = {
					query:"religion",
					location:current_location,
					radius:1000,
					types:["church","mosque","synagogue","hindu_temple"],
				}
				performSearch(searchObj,(i+1),"faith",function(params){
					results.push(params);
					if(results.length == 5){
						getAllDistances(results,current_location);
					}
				})
				break;
			default:
				return;
		}
	}
}

/*
Utilizes gmaps Text Search API. Request object is formatted within the switch cases in the getResults
function. Callback function sends the search results into the getAllDistances function.
*/
function performSearch(text_request, rank, category, callback){
	service.textSearch(text_request, function (results,status){
		var searchResults =[];
		if(status == google.maps.places.PlacesServiceStatus.OK){
			for(var i=0;i<results.length;i++){
				searchResults.push({
					name:results[i].name,
					lat:results[i].geometry.location.lat(),
					lng:results[i].geometry.location.lng(),
					rank: rank,
					category: category,
				});
			};
			callback(searchResults);
		}
		else{
			errorStatus(status)
		};
	});
};

/*
Sends each search result to the getDistance function. Once the distanceArr reaches a length of 5,
the results are sent to the remove_far function to filter our results that are greater than 5miles or 
8000 meters. Again, this callback formatting is to deal with javascripts asycronous behavior. If the 
if statement didn't exist, the function would continue to execute before the API served any results.
*/

function getAllDistances(results,current_location){
	var distanceArr = [];
	console.log(results)
	for(var i = 0;i<results.length;i++){
		getDistance(results[i],current_location,function(params){
			distanceArr.push(params)
			if(distanceArr.length == 5){
				console.log(distanceArr)
				remove_far(distanceArr);
			}else{
				console.log('getAllDistances.else')
			}
		})
	}
}

//filters results further than 5miles or 8000 meters
function remove_far(results){
	console.log(results)
	var filtered = [];
	for(var i = 0;i<results.length;i++){
		var temp = [];
		for(var j=0;j<results[i].length;j++){
			if(results[i][j].distance <= 8000){
				
				temp.push(results[i][j]);
			}
		}
		filtered.push(temp);
	}
	console.log(filtered)
	category_score(filtered)
}

//Provides scores for each individual category, instead of an aggregate score
function category_score(arr,callback){
	//the first index of each array will keep track of the score total, while the 
	//second index being pushed into will keep track of the rank
	var sums = {
		food: [0],
		culture: [0],
		shopping: [0],
		health: [0],
		transportation: [0],
		nightlife: [0],
		faith: [0], 
	}

	for (var i = 0;i<arr.length;i++){
		for(var j = 0;j<arr[i].length;j++){
			switch (arr[i][j].category){
				case "food":
					sums.food[0] += distanceVal(arr[i][j].distance)
					if(!sums.food[1]){
						sums.food.push(arr[i][j].rank)
					}
					break;
				case "culture":
					sums.culture[0] += distanceVal(arr[i][j].distance)
					if(!sums.culture[1]){
						sums.culture.push(arr[i][j].rank)
					}
					break;
				case "shopping":
					sums.shopping[0] += distanceVal(arr[i][j].distance)
					if(!sums.shopping[1]){
						sums.shopping.push(arr[i][j].rank)
					}
					break;
				case "health":
					sums.health[0] += distanceVal(arr[i][j].distance)
					if(!sums.health[1]){
						sums.health.push(arr[i][j].rank)
					}
					break;
				case "transportation":
					sums.transportation[0] += distanceVal(arr[i][j].distance)
					if(!sums.transportation[1]){
						sums.transportation.push(arr[i][j].rank)
					}
					break;
				case "nightlife":
					sums.nightlife[0] += distanceVal(arr[i][j].distance)
					if(!sums.nightlife[1]){
						sums.nightlife.push(arr[i][j].rank)
					}
					break;
				case "faith":
					sums.faith[0] += distanceVal(arr[i][j].distance)
					if(!sums.faith[1]){
						sums.faith.push(arr[i][j].rank)
					}
					break;
				default:
					return;
			}
			
		}
	}
	weighted_score(sums);
	// category_graph(sums);
}

/*
Utilizes gMaps Distance Matrix API to calculate distances from each search results to the 
user's inputed location.
*/

function getDistance(arr,origin,callback){
	var destinationArr = [];
	for(var i = 0; i<arr.length;i++){
		destinationArr.push(new google.maps.LatLng(arr[i].lat,arr[i].lng));
	};
	

	//gMaps Method to Calculate distance between 2 coordinates
	matrix.getDistanceMatrix({
		origins: [origin],
		destinations: destinationArr,
		unitSystem: google.maps.UnitSystem.IMPERIAL,
		travelMode: google.maps.TravelMode.WALKING,
	},function(response,status){
		if (status == google.maps.DistanceMatrixStatus.OK) {
			//there is only one origin point so we hard code the first element into var results
		    var results = response.rows[0].elements;
		    //next we iterate through the destination results and store all distance values into
		    //the original hash that was inputed into this function
	        for (var j = 0; j < results.length; j++) {
	        	// console.log(results[j].distance)
				arr[j]['distance'] = results[j].distance.value
	
		    }
		    // console.log(results)
		    callback(arr)
		}
		else{
			errorStatus(status);
		};	

	})
}

function distanceVal(distance){
	var value = 0
	if (distance < 900){
		value = 6
	}
	else if (distance < 1500){
		value = 5
	}
	else if (distance < 1800){
		value = 4
	}
	else if (distance < 2000){
		value = 3
	}
	else{
		value = 2
	};

	return value;	
}


function weighted_score(sums){
	//checks the second index for the rank of the category and multiplies it
	//to corresponding multiplier
	var total = 0
	for(key in sums){
		if(sums[key][1] == 1){
			total += sums[key][0] * 0.35/*0.28 0.2254*/
		}
		else if(sums[key][1] == 2){
			total += sums[key][0] * 0.28/*0.24 0.1979*/
		}
		else if(sums[key][1] == 3){
			total += sums[key][0] * 0.26/*0.20 0.1703*/
		}
		else if(sums[key][1] == 4){
			total += sums[key][0] * 0.24/*0.16 0.1428*/
		}
		else if(sums[key][1] == 5){
			total += sums[key][0] *  0.18/*0.12 0.1153*/
		}
		else if(sums[key][1] == 6){
			total += sums[key][0] * 0.0879
		}
		else if(sums[key][1] == 7){
			total += sums[key][0] * 0.0604
		}
	}
	total = Math.round(total);
	showScore(total);
}

//Shows user's score in a gMaps infoWindow.
function showScore(total){
	// console.log(total)
	infowindow.open(map, marker);
	// infowindow.setContent("<h1>"+total+"/100</h1>")
	infowindow.setContent("<div id='container-speed' style='width:150px;height:110px'></div>")
	$(function () {

	    var gaugeOptions = {

	        chart: {
	            type: 'solidgauge'
	        },

	        title: null,

	        pane: {
	            center: ['50%', '85%'],
	            size: '140%',
	            startAngle: -90,
	            endAngle: 90,
	            background: {
	                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
	                innerRadius: '60%',
	                outerRadius: '100%',
	                shape: 'arc'
	            }
	        },

	        tooltip: {
	            enabled: false
	        },

	        // the value axis
	        yAxis: {
	            stops: [
	                [0.1, '#55BF3B'], // green
	                [0.5, '#DDDF0D'], // yellow
	                [0.9, '#DF5353'] // red
	            ],
	            lineWidth: 0,
	            minorTickInterval: null,
	            tickPixelInterval: 400,
	            tickWidth: 0,
	            title: {
	                y: -70
	            },
	            labels: {
	                y: 16
	            }
	        },

	        plotOptions: {
	            solidgauge: {
	                dataLabels: {
	                    y: 5,
	                    borderWidth: 0,
	                    useHTML: true
	                }
	            }
	        }
	    };

	    // The speed gauge
	    $('#container-speed').highcharts(Highcharts.merge(gaugeOptions, {
	        yAxis: {
	            min: 0,
	            max: 100,
	            title: {
	                text: 'Your VentureScore'
	            }
	        },

	        credits: {
	            enabled: false
	        },

	        series: [{
	            name: 'Speed',
	            data: [total],
	            dataLabels: {
	                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
	                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
	                       '<span style="font-size:12px;color:silver">Points</span></div>'
	            },
	            tooltip: {
	                valueSuffix: ' km/h'
	            }
	        }]

	    }));	
	});
}


