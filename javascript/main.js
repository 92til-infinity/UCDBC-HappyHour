// var userInput;

var userLongitude;
var userLatitude;


$(".buttonDesign").on("click", function () {
    event.preventDefault();
    const request = $(this).attr("id");
    $("#locale-buttons").html("");
    console.log(request);

    // userInput = $("#searchInput").val().trim();
    // console.log(userInput);
    if (request !== "") {
        //clear the previous search
        clear();
        //clear the search field value
        $("#searchinput").val("");
    }
    getBeerList(request);
});

function getBeerList(request) {

    //get 5 day forecast
    var zomatoURL = "https://developers.zomato.com/api/v2.1/search?q=" + request + "&count=5&lat=" + userLatitude + "&lon=" + userLongitude;
    // console.log(zomatoURL);
    $.ajax({
        url: zomatoURL,
        method: "GET",
        headers: { "user-key": "4d08f1088ece3e99c9b69a373a097eed" }
        // curl - X GET--header "Accept: application/json" --header "user-key: 4d08f1088ece3e99c9b69a373a097eed" "https://developers.zomato.com/api/v2.1/search"
    })
        .then(function (response) {
            // ________________________
            var responseADDRESS = [];
            // ________________________
            //add container div for forecast cards
            // let newLIST = $("<ul>").addClass("list-group");
            // $("#locale-buttons").append(newLIST);
            console.log(response);

            //loop through array response to find the names and addresses of each restauarant for 15:00
            for (let i = 0; i < response.restaurants.length; i++) {
                console.log(response.restaurants[i].restaurant.name);
                const restNAME = response.restaurants[i].restaurant.name;
                const restADDRESS = response.restaurants[i].restaurant.location.address;
                const restCITY = response.restaurants[i].restaurant.location.city;
                const restPRICE = response.restaurants[i].restaurant.price_range;
                // in 1 - 5 scale symbols
                const restREVIEW = response.restaurants[i].restaurant.user_rating.aggregate_rating;
                // in user review integer
                const responseLATLON = {
                    latitude: response.restaurants[i].restaurant.location.latitude,
                    longitude: response.restaurants[i].restaurant.location.longitude,
                    name: response.restaurants[i].restaurant.name
                };

                responseADDRESS.push(responseLATLON);

                const listBodyText = $("<button>").addClass("list-group-item list-group-item-action list-text")
                    .text(restNAME);
                const goButton = $("<button>").addClass("goButton").attr("id", i).text("GO");
                $(listBodyText).append(goButton);
                $("#locale-buttons").append(listBodyText);

                //listBodyText.append($("<p>").addClass("list-text").text(restNAME);
                // listBodyText.append($("<p>").attr("class", "list-text").html("address: " + restADDRESS + "."));
                // listBodyText.append($("<p>").attr("class", "list-text").html("city: " + restCITY + "."));
                listBodyText.append($("<p>").attr("class", "list-text").html("Price: " + restPRICE + "/5"));
                listBodyText.append($("<p>").attr("class", "list-text").html("Avg Review: " + restREVIEW));

            }
            localStorage.setItem("responseADDRESS", JSON.stringify(responseADDRESS));
            mapMarkers(responseADDRESS);
        });
}

// ________________________

function clear() {
    $("#searchInput").empty();
    $("#listgroup").empty();
}

// ____________________

// function addPointsToMap(responseADDRESS) {
//     for (var i = 0; i < responseADDRESS.length; i++) {
//         var mapPoints = responseADDRESS[i];
//         console.log(mapPoints[0], mapPoints[1]);
//     }
// }


// ________________________ // ________________________
// var geoURL = "https://api.ipgeolocation.io/ipgeo?apiKey=9b336091095743018515a967edc697aa&fields=geo"
// $.ajax({
//     url: geoURL,
//     method: "GET"

// })
//     .then(function (response) {
//         console.log(response);
//         console.log(response.latitude);
//         console.log(response.longitude);
//         userLongitude = response.longitude;
//         userLatitude = response.latitude;
//     });
// ________________________ // ________________________ // ________________________

//getBeerList();
//console.log(responseADDRESS);

mapboxgl.accessToken = "pk.eyJ1IjoicmFza29nIiwiYSI6ImNrOXhvOTdleTA1bHozbXBtc3R0ZDVkODIifQ.706vwlV4IYaDY7ZTOLEt9w";

let end = [userLongitude, userLatitude];
let marker = new mapboxgl.Marker();

let map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v10",
    center: [-121.4855, 38.5624],
    zoom: 1
});

let geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
})

map.addControl(geolocate);

map.on("load", function () {
    geolocate.trigger();
    start = map.getCenter();
})

geolocate.on("geolocate", function (position) {
    // console.log(position);
    const coords = [position.coords.longitude, position.coords.latitude];
    marker.setLngLat(coords).addTo(map);
})

// Create map markers for the five returned searches
function mapMarkers(restArray) {
    for (i = 0; i < restArray.length; i++) {
        let newMark = new mapboxgl.Marker()
            .setLngLat([restArray[i].longitude, restArray[i].latitude])
            .setPopup(new mapboxgl.Popup().setHTML("<h6>" + restArray[i].name + "</h6>"))
            .addTo(map);
    }
}

map.on('load', function () {

    map.addLayer({
        id: 'point',
        type: 'circle',
        source: {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Point',
                        coordinates: start
                    }
                }
                ]
            }
        },
        paint: {
            'circle-radius': 10,
            'circle-color': '#3887be'
        }
    });
})

//let canvas = map.getCanvasContainer();

$("body").on("click", ".goButton", function () {

    event.stopPropagation();

    const responseADDRESS = JSON.parse(localStorage.getItem("responseADDRESS"));
    const getIndex = $(this).attr("id");
    const endLon = responseADDRESS[getIndex].longitude;
    const endLat = responseADDRESS[getIndex].latitude;
    const start = marker.getLngLat();

    let targetURL = "https://api.mapbox.com/directions/v5/mapbox/cycling/" + start.lng + ","
        + start.lat + ";" + endLon + "," + endLat + "?steps=true&geometries=geojson&access_token="
        + mapboxgl.accessToken;

    var req = new XMLHttpRequest();
    req.open("GET", targetURL, true);
    req.onload = function () {

        let json = JSON.parse(req.response);
        let data = json.routes[0];
        let route = data.geometry.coordinates;
        let geojson = {
            type: "Feature",
            properties: {},
            geometry: {
                type: "LineString",
                coordinates: route
            }
        };

        // If the route already exists on the map
        if (map.getSource("route")) {
            map.getSource("route").setData(geojson);
        } else {
            map.addLayer({
                id: "route",
                type: "line",
                source: {
                    type: "geojson",
                    data: {
                        type: "Feature",
                        properties: {},
                        geometry: {
                            type: "LineString",
                            coordinates: geojson
                        }
                    }
                },
                layout: {
                    "line-join": "round",
                    "line-cap": "round"
                },
                paint: {
                    "line-color": "#3887be",
                    "line-width": 5,
                    "line-opacity": 0.75
                }
            });
        }
        // add turn instruction here
        const instructions = $("#instructions");
        let steps = data.legs[0].steps;

        let tripInstructions = [];
        for (let i = 0; i < steps.length; i++) {
            tripInstructions.push("<br><li>" + steps[i].maneuver.instruction) + "</li>";
            $("#instructions").html("<br><span class='duration'>Trip duration: "
                + Math.floor(data.duration / 60) + " min 🚴 </span>" + tripInstructions);
        }
    };
    req.send();
})




