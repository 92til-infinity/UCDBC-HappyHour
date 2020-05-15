var currentMarkers = [];

$(".instructionList").hide();
$(".buttonDesign").on("click", function () {
    event.preventDefault();

    const request = $(this).attr("id");
    $("#locale-buttons").html("");

    getBeerList(request);
});

function getBeerList(request) {

    var geoURL = "https://api.ipgeolocation.io/ipgeo?apiKey=9b336091095743018515a967edc697aa&fields=geo"
    $.ajax({
        url: geoURL,
        method: "GET"
    })
        .then(function (response) {
            const userLongitude = response.longitude;
            const userLatitude = response.latitude;

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
                        // const restADDRESS = response.restaurants[i].restaurant.location.address;
                        // const restCITY = response.restaurants[i].restaurant.location.city;
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

                        const listBodyText = $("<li>").addClass("list-group-item list-group-item-active list-text")
                            .attr("id", i).text(restNAME);
                        const goButton = $("<button>").addClass("goButton").attr("id", i).text("GO");
                        $(listBodyText).append(goButton);
                        $("#locale-buttons").append(listBodyText);

                        //listBodyText.append($("<p>").addClass("list-text").text(restNAME);
                        // listBodyText.append($("<p>").attr("class", "list-text").html("address: " + restADDRESS + "."));
                        // listBodyText.append($("<p>").attr("class", "list-text").html("city: " + restCITY + "."));
                        listBodyText.append($("<p>").text("Price: " + restPRICE + "/5"));
                        listBodyText.append($("<p>").text("Avg Review: " + restREVIEW));

                    }
                    localStorage.setItem("responseADDRESS", JSON.stringify(responseADDRESS));
                    clear();
                    mapMarkers(responseADDRESS);

                });
        })
}

// ________________________

function clear() {
    if (currentMarkers !== null) {
        for (var i = currentMarkers.length - 1; i >= 0; i--) {
            currentMarkers[i].remove();
        }
    }
}


mapboxgl.accessToken = "pk.eyJ1IjoicmFza29nIiwiYSI6ImNrOXhvOTdleTA1bHozbXBtc3R0ZDVkODIifQ.706vwlV4IYaDY7ZTOLEt9w";

let marker = new mapboxgl.Marker();
let restBox = [];

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

        let newMark = new mapboxgl.Marker({
            color: "darkslategrey"
        })
            .setLngLat([restArray[i].longitude, restArray[i].latitude])
            .setPopup(new mapboxgl.Popup().setHTML("<p>" + restArray[i].name + "</p>"))
            .addTo(map);

        $(newMark).addClass("destinations");
        currentMarkers.push(newMark);
    }
}

// map.on('load', function () {

//     map.addLayer({
//         id: 'point',
//         type: 'circle',
//         source: {
//             type: 'geojson',
//             data: {
//                 type: 'FeatureCollection',
//                 features: [{
//                     type: 'Feature',
//                     properties: {},
//                     geometry: {
//                         type: 'Point',
//                         coordinates: start
//                     }
//                 }
//                 ]
//             }
//         },
//         paint: {
//             'circle-radius': 10,
//             'circle-color': '#3887be'
//         }
//     });
// })

//let canvas = map.getCanvasContainer();

function fillBox() {
    if (restBox.length == 0) {
        restBox = JSON.parse(localStorage.getItem("responseADDRESS"));
        console.log("This array is empty");
    } else {
        return;
    }
}

$("body").on("click", ".list-text", function (event) {

    event.stopPropagation();
    fillBox();

    const getIndex = $(this).attr("id");
    const endLat = restBox[getIndex].latitude;
    const endLon = restBox[getIndex].longitude;
    map.setCenter([endLon, endLat]);
    currentMarkers[getIndex].togglePopup();
})

$("body").on("click", ".goButton", function (event) {

    event.stopPropagation();

    $(".list-group-item ").hide();
    $(".instructionList").show();
    const responseADDRESS = JSON.parse(localStorage.getItem("responseADDRESS"));
    const getIndex = $(this).attr("id");
    const endLon = parseFloat(responseADDRESS[getIndex].longitude);
    const endLat = parseFloat(responseADDRESS[getIndex].latitude);
    const start = marker.getLngLat();
    const midpointLon = ((endLon + start.lng) / 2);
    const midpointLat = ((endLat + start.lat) / 2);
    map.setCenter([midpointLon, midpointLat]);
    map.zoomTo(11);
    clear();

    // End destination marker after we clear all the markers
    let endMark = new mapboxgl.Marker({
        color: "darkslategrey"
    })
        .setLngLat([endLon, endLat])
        .addTo(map);
    currentMarkers.push(endMark);

    let targetURL = "https://api.mapbox.com/directions/v5/mapbox/cycling/" + start.lng + ","
        + start.lat + ";" + endLon + "," + endLat + "?steps=true&geometries=geojson&access_token="
        + mapboxgl.accessToken;

    var req = new XMLHttpRequest();
    req.open("GET", targetURL, true);
    req.onload = function () {
        console.log("onload() called")
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
        }

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
            map.getSource("route").setData(geojson);
        }
        // add turn instruction here
        let steps = data.legs[0].steps;
        let tripInstructions = [];
        for (let i = 0; i < steps.length; i++) {

            tripInstructions.push("<br></br>" + "<li>" + steps[i].maneuver.instruction + " ");
            $(".Trip").html("<br><span class='duration'>Trip duration: "
                + Math.floor(data.duration / 60) + " min 🚴 </span>" + tripInstructions);
        }
    };
    req.send();
})


