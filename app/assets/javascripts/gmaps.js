/*Remember to check lengths and query amounts*/
$(document).ready(function(){
	$( "#interest" ).click(function(){
		//grabs rankings of each category
		var ranking = create_search_array();
		//sends each category to be searched
		getResults(ranking,current_location);
	});	
	//sends a different search obj depending on the ctegory. callback is sent to getAllDistances
	function getResults(ranking,current_location){
		var results = [];
		for (var i = 0;i<1/*ranking.length*/;i++){
			switch(ranking[i].category){
				case "food":
					var searchObj = {
						query: "resaurants, food, cafe,",
						location:current_location,
						radius: 1000,
						types:["restaurant"],
					}
					performSearch(searchObj,function(params){
						results.push(params);
						if(results.length == 1){
							getAllDistances(results);
						}
					})
					break;
				case "culture":
					//block
					var searchObj = {
						query: "museum",
						location: current_location,
						radius: 1000,
						types:["museum"],
					}
					performSearch(searchObj,function(params){
						results.push(params);
						if(results.length == 1){
							getAllDistances(results);
						}
					})
					break;
				case "shopping":
					//block
					var searchObj = {
						query: "shopping mall",
						location: current_location,
						radius: 1000,
						types:["shopping_mall"],
					}
					performSearch(searchObj,function(params){
						results.push(params);
						if(results.length == 1){
							getAllDistances(results);
						}
					})
					break;
				case "health":
					//block
					var searchObj = {
						query:"park",
						location:current_location,
						radius: 1000,
						types:["park"],
					}
					performSearch(searchObj,function(params){
						results.push(params);
						if(results.length == 1){
							getAllDistances(results);
						}
					})
					break;
				case "transportation":
					//block
					var searchObj = {
						query: "bus station",
						location: current_location,
						radius: 1000,
						types:["bus_station"],
					}
					performSearch(searchObj,function(params){
						results.push(params);
						if(results.length == 1){
							getAllDistances(results);
						}
					})
					break;
				case "nightlife":
					//block
					var searchObj = {
						query: "nightclub",
						location:current_location,
						radius:1000,
						types:["night_club"],
					}
					performSearch(searchObj,function(params){
						results.push(params);
						if(results.length == 1){
							getAllDistances(results);
						}
					})
					break;
				case "faith":
					//block
					var searchObj = {
						query:"church",
						location:current_location,
						radius:1000,
						types:["church"],
					}
					performSearch(searchObj,function(params){
						results.push(params);
						if(results.length == 1){
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
				if(distanceArr.length == 1){
					remove_far(distanceArr);
				}
			})
		}
	}
	
	function remove_far(results){
		console.log(results)
	}

	initialize();

	var current_location;

	var input = document.getElementById('pac-input'); //$('#pac-input').val()
	var autocomplete = new google.maps.places.Autocomplete(input)
	autocomplete.bindTo('bounds', map);

	var infowindow = new google.maps.InfoWindow();
	var marker = new google.maps.Marker({
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

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address + '<br>' + '<strong>' +  "Latitude: " + '</strong>' + latitude + '<strong>' +  "  Longitude:  " + '</strong>' +longitude)
    infowindow.open(map, marker);
  });

});

var map;
var service;
var geocorder;
var matrix;


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
			scrollwheel:false,
		}
	// };

	//Creating instances of various Map objects
	map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions)
	service = new google.maps.places.PlacesService(map);
	geocoder = new google.maps.Geocoder();
	matrix = new google.maps.DistanceMatrixService();

}

//returns an object that ranks all of the categories. this will be used for searching gmaps db
function create_search_array(){
	var myVals = [];
	var count = 1
	$( '.categories' ).each(function(){
	  	myVals.push({
	  		category: $(this).attr('name'),
	  		rank: count,
	  	});
	  	count ++;
	});
	return myVals
}


function performSearch(text_request, callback){
	//Location box should be dynamic and set based on the users location or input
	// var locationBox = 

	//Search obj for gMaps text search
	// text_request = {
	// 	query: "izakaya japanese food",
	// 	location: coords,
	// 	radius: 1000,
	// 	types: ["restaurant","bar","food"]
	// }
	// radar_request = {
	// 	keyword: "izakaya japanese food",
	// 	location: locationBox,
	// 	radius: 1000,
	// 	types: ["restaurant","bar","food"]
	// }
	// service.textSearch(text_request,latLngArr)

	service.textSearch(text_request, function(results,status){
		var searchResults =[];
		if(status == google.maps.places.PlacesServiceStatus.OK){
			for(var i=0;i<results.length;i++){
				searchResults.push({
					name:results[i].name,
					lat:results[i].geometry.location.lat(),
					lng:results[i].geometry.location.lng()
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
		// :::: Other optional parameters to add to search ::::
	    // transitOptions: TransitOptions,
	    // durationInTraffic: true,
	    // avoidHighways: false,
	    // avoidTolls: false,
	},function(response,status){
		if (status == google.maps.DistanceMatrixStatus.OK) {
			console.log(response);
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
}
	

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
