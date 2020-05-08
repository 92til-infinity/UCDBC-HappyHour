// var userInput = "BEER"
// ---set location just to sac for now till will pull the "user location" from mapbox or choose a set area
// var lat = 38.5727
// var lon = -121.4679
// var radius = 150
var queryURL = "https://developers.zomato.com/api/v2.1/search?q=" + userInput + "&count=10&lat=" + lat + "&lon=" + lon + "&radius=" + radius;
$.ajax({
    url: queryURL,
    method: "GET"
})
    // After the data comes back from the API
    .then(function (response) {
        console.log(response);
    });