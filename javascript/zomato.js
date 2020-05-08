var userInput = "BEER"
// ---set location just to sac for now till will pull the "user location" from mapbox or choose a set area
var lat = 38.5727;
var lon = -121.4679;
var radius = 150;
var queryURL = "https://developers.zomato.com/api/v2.1/search?q=beer&count=10&lat=38.5727&lon=-121.4679&radius=150";
$.ajax({
    url: queryURL,
    method: "GET",
    headers: { "user-key": "4d08f1088ece3e99c9b69a373a097eed" }
    // curl - X GET--header "Accept: application/json" --header "user-key: 4d08f1088ece3e99c9b69a373a097eed" "https://developers.zomato.com/api/v2.1/search"
})
    // After the data comes back from the API
    .then(function (response) {
        console.log(response);
        console.log(response.restaurants[0].restaurant.name);

        // append all infor to HTML here
    });