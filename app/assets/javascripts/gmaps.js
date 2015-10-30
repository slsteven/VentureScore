/*Remember to check lengths and query amounts*/
$(document).ready(function(){
	
	//sends a different search obj depending on the ctegory. callback is sent to getAllDistances
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
						if(results.length == 5
							){
							getAllDistances(results);
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
						if(results.length == 5
							){
							getAllDistances(results);
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
						if(results.length == 5
							){
							getAllDistances(results);
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
						if(results.length == 5
							){
							getAllDistances(results);
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
						if(results.length == 5
							){
							getAllDistances(results);
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
						if(results.length == 5
							){
							getAllDistances(results);
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
						if(results.length == 5
							){
							getAllDistances(results);
						}
					})
					break;
				default:
					return;
			}
		}
	}
	//Sends arrays to  distance matrix and adds 'distance' key to each search result.
	//Callback sent to remove_far to remove all distances greater than 5 miles or 8000meters
	function getAllDistances(results){
		// console.log(results)
		var distanceArr = [];
		for(var i = 0;i<results.length;i++){
			getDistance(results[i],current_location,function(params){
				distanceArr.push(params)
				if(distanceArr.length == 5
					){
					remove_far(distanceArr);
				}
			})
		}
	}
	//filters results further than 5miles or 8000 meters
	function remove_far(results){
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
		// console.log(filtered)
		category_score(filtered)
	}

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
		console.log(sums)
		weighted_score(sums);
		category_graph(sums);
	}

	function weighted_score(sums){
		//checks the second index for the rank of the category and multiplies it
		//to corresponding multiplier
		var total = 0
		for(key in sums){
			if(sums[key][1] == 1){

				total += sums[key][0] * 0.28/*0.2254*/
			}
			else if(sums[key][1] == 2){
				total += sums[key][0] * 0.24 /*0.1979*/
			}
			else if(sums[key][1] == 3){
				total += sums[key][0] * 0.20 /*0.1703*/
			}
			else if(sums[key][1] == 4){
				total += sums[key][0] * 0.16 /*0.1428*/
			}
			else if(sums[key][1] == 5){
				total += sums[key][0] * 0.12 /*0.1153*/

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

	function category_graph(totals){
		var data_obj = {
	        chart: {
	            type: 'column'
	        },
	        title: {
	            text: 'Category Breakdown'
	        },
	 
	        xAxis: {
	            // categories: [],
	            crosshair: true
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: 'Score'
	            }
	        },
	        tooltip: {
	            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
	            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
	                '<td style="padding:0"><b>{point.y:.1f} points</b></td></tr>',
	            footerFormat: '</table>',
	            shared: true,
	            useHTML: true
	        },
	        plotOptions: {
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            }
	        },
	        series: []
	    }
	    for(category in totals){
	    	data_obj.series.push({
	    		name: category,
	    		data: [totals[category][0]]
	    	});
	    	// data_obj.xAxis["categories"].push(category)
	    };
		$(function () {
		    $('#container').highcharts(data_obj);
		});
	}
	function distanceVal(distance){
		var value = 0
		if (distance < 482){
			value = 5
		}
		else if (distance < 1209){
			value = 4.5
		}
		else if (distance < 1814){
			value = 4
		}
		else if (distance < 2401){
			value = 3.5
		}
		else{
			value = 3
		};
	
		return value;	
	}
	initialize();
	var current_location;

	var input = document.getElementById('pac-input'); //$('#pac-input').val()
	autocomplete = new google.maps.places.Autocomplete(input)
	autocomplete.bindTo('bounds', map);

	infowindow = new google.maps.InfoWindow();
	marker = new google.maps.Marker({
		map: map,
		draggable: true,
		anchorPoint: new google.maps.Point(0, -29)
	});

	autocomplete.addListener('place_changed', function() {
		infowindow.close();
		marker.setVisible(false);
		var place = autocomplete.getPlace();

		var latitude = place.geometry.location.lat()
		var longitude = place.geometry.location.lng()

		current_location = place.geometry.location



	    if (!place.geometry) {
			window.alert("Autocomplete's returned place contains no geometry");
			return;
	    }

	    // If the place has a geometry, then present it on a map.
		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(13);  // Why 13? Because it looks good.
		}
		marker.setIcon(/** @type {google.maps.Icon} */({
			url: "http://content.sportslogos.net/logos/6/235/full/5gzur7f6x09cv61jt16smhopl.gif", 
			size: new google.maps.Size(71, 71),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(17, 34),
			scaledSize: new google.maps.Size(35, 35)
		}));

	    marker.setPosition(place.geometry.location);
	    marker.setVisible(true);

	    var address = '';
	    if (place.address_components) {
	      address = [
	        (place.address_components[0] && place.address_components[0].short_name || ''),
	        (place.address_components[1] && place.address_components[1].short_name || ''),
	        (place.address_components[2] && place.address_components[2].short_name || '')
	      ].join(' ');
	    }

	    // infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address + '<br>' + '<strong>' +  "Latitude: " + '</strong>' + latitude + '<strong>' +  "  Longitude:  " + '</strong>' +longitude)
	    // infowindow.open(map, marker);
	    $( "#interest" ).click(function(){
			//grabs rankings of each category
			var ranking = create_search_array();
			//sends each category to be searched
			getResults(ranking,current_location);
			// infowindow.open(map, marker);
		});		
    });
	function showScore(score){
		infowindow.open(map, marker);
		infowindow.setContent("<div id='container-rpm'></div>")
		 // The RPM gauge
	    $(function () {

    var gaugeOptions = {

        chart: {
            type: 'solidgauge'
        },

        title: null,

        pane: {
            center: ['50%', '85%'],
            size: '100%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc',
                background: 'black'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis55BF3B
        yAxis: {
            stops: [
                [0.1, '#DF5353'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#55BF3B'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            title: {
                y: -70
            },
            labels: {
                y: 0
            }
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true,
                    animation: false
                }
            }
        }
    };

    // The speed gauge
    $('#container-speed').highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 200,
            title: {
                text: 'Speed'
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'Speed',
            data: [80],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                       '<span style="font-size:12px;color:silver">km/h</span></div>'
            },
            tooltip: {
                valueSuffix: ' km/h'
            }
        }]

    }));

    // The RPM gauge
    $('#container-rpm').highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: 'VentureScore'
            }
        },

        series: [{
            name: 'RPM',
            data: [score],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                       '<span style="font-size:12px;color:silver">/100</span></div>'
            },
            tooltip: {
                valueSuffix: ' revolutions/min'
            }
        }]

    }));

    // Bring life to the dials
    setInterval(function () {
        // Speed
        var chart = $('#container-speed').highcharts(),
            point,
            newVal,
            inc;

        if (chart) {
            point = chart.series[0].points[0];
           
            newVal = point.y;

            if (newVal < 0 || newVal > 200) {
                newVal = point.y - inc;
            }

            point.update(newVal);
        }

        // RPM
        chart = $('#container-rpm').highcharts();
        if (chart) {
            point = chart.series[0].points[0];
           
            newVal = point.y;

            if (newVal < 0 || newVal > 5) {
                newVal = point.y;
            }

            point.update(newVal);
        }
    }, 2000);

	})

};
var map;
var service;
var geocorder;
var matrix;
var maker;
var autocomplete;
var infowindow

//initializes map
function initialize(){
	//if the geolocation arrray exists, we insert the LatLng into the query object
	// if (geolocation){
	// 	var mapOptions = {
	// 		center: {lat: geolocation[0], lng: geolocation[1]},
	// 		zoom: 4
	// 	}
	// }
	//otherwise we use the center of the united states as default
	// else{
		var mapOptions = {
			center: {lat: 40.524, lng: -97.884},
			zoom: 4,
			scrollwheel: false
	
		}

	// };

	//Creating instances of various Map objects
	map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions)
	service = new google.maps.places.PlacesService(map);
	geocoder = new google.maps.Geocoder();
	matrix = new google.maps.DistanceMatrixService();

	//prevents map from scrolling down unless clicked first.
	 map.addListener('click', function()
	   { 
	  	  if(map) map.setOptions({ scrollwheel: true }); 
	   });
	 map.addListener('mouseout', function()
	  	{ 
	  	  if(map) map.setOptions({ scrollwheel: false });
	    })

}
//returns an object that ranks all of the categories. this will be used for searching gmaps db
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


function performSearch(text_request, rank, category, callback){
	service.textSearch(text_request, function(results,status){
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
 //Takes array of objects which contains coordinates and names of searched locations
 //Origin a gMaps LatLng obj of the location being scored
function getDistance(arr,origin,callback){
	var destinationArr = [];
	//Iterate through coordinates array and create a new LatLng obj for each value. This
	//is to prepare for gMaps matrix search that will calculate distance and travel time
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
				arr[j]['distance'] = results[j].distance.value
		    }
		    callback(arr)
		}
		else{
			errorStatus(status);
		};	

	})	

    };


})


//Call back to handle errors during search
function errorStatus(status){
  switch(status){
    case "ERROR": alert("There was a problem contacting Google Servers");
      break;
    case "INVALID_REQUEST": alert("This request was not valid");
      break;
    case "OVER_QUERY_LIMIT": alert("This webpage has gone over its request quota");
      break;
    case "NOT_FOUND": alert("This location could not be found in the database");
      break;
    case "REQUEST_DENIED": alert("The webpage is not allowed to use the PlacesService");
      break;
    case "UNKNOWN_ERROR": alert("The request could not be processed due to a server error. The request may succeed if you try again");
      break;
    case "ZERO_RESULTS": alert("No result was found for this request. Please try again");
      break;
    default: alert("There was an issue with your request. Please try again.")
  };
};