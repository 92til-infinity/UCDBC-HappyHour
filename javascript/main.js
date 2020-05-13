var userInput;
var userLongitude;
var userLatitude;
var responseADDRESS = [];

$("#searchButton").on("click", function () {
    event.preventDefault();
    userInput = $("#searchInput").val().trim();
    // console.log(userInput);
    if (userInput !== "") {
        //clear the previous search
        clear();
        //clear the search field value
        $("#searchinput").val("");
    }
    getBeerList(userInput);
});

function getBeerList() {
    //get 5 day forecast
    var zomatoURL = "https://developers.zomato.com/api/v2.1/search?q=" + userInput + "&count=5&lat=" + userLatitude + "&lon=" + userLongitude;
    // console.log(zomatoURL);
    $.ajax({
        url: zomatoURL,
        method: "GET",
        headers: { "user-key": "4d08f1088ece3e99c9b69a373a097eed" }
        // curl - X GET--header "Accept: application/json" --header "user-key: 4d08f1088ece3e99c9b69a373a097eed" "https://developers.zomato.com/api/v2.1/search"
    })
        .then(function (response) {
            // ________________________

            // ________________________
            //add container div for forecast cards
            var newLIST = $("<ul>").attr("class", "list-group");
            $("#listgroup").append(newLIST);
            console.log(response);

            //loop through array response to find the names and addresses of each restauarant for 15:00
            for (var i = 0; i < response.restaurants.length; i++) {
                console.log(response.restaurants[i].restaurant.name);
                var restNAME = response.restaurants[i].restaurant.name;
                var restADDRESS = response.restaurants[i].restaurant.location.address;
                var restCITY = response.restaurants[i].restaurant.location.city;
                var restPRICE = response.restaurants[i].restaurant.price_range;
                // in 1 - 5 scale symbols
                var restREVIEW = response.restaurants[i].restaurant.user_rating.aggregate_rating;
                // in user review integer
                var responseLATLON = [response.restaurants[i].restaurant.location.latitude, response.restaurants[i].restaurant.location.longitude];
                responseADDRESS.push(responseLATLON);

                var listBodyText = $("<li>").attr("class", "list-group-item list-group-item-action");
                newLIST.append(listBodyText);

                listBodyText.append($("<p>").attr("class", "list-text").html("name: " + restNAME + "."));
                listBodyText.append($("<p>").attr("class", "list-text").html("address: " + restADDRESS + "."));
                listBodyText.append($("<p>").attr("class", "list-text").html("city: " + restCITY + "."));
                listBodyText.append($("<p>").attr("class", "list-text").html("price rating: " + restPRICE + "/5."));
                listBodyText.append($("<p>").attr("class", "list-text").html("average user review: " + restREVIEW + "."));



            }
            addPointsToMap(responseADDRESS);

        });
}



// ________________________

function clear() {
    $("#searchInput").empty();
    $("#listgroup").empty();
}

// ____________________

function addPointsToMap(responseADDRESS) {
    for (var i = 0; i < responseADDRESS.length; i++) {
        var mapPoints = responseADDRESS[i];
        console.log(mapPoints[0], mapPoints[1]);
    }
}


// ________________________ // ________________________
var geoURL = "https://api.ipgeolocation.io/ipgeo?apiKey=9b336091095743018515a967edc697aa&fields=geo"
$.ajax({
    url: geoURL,
    method: "GET"

})
    .then(function (response) {
        console.log(response);
        console.log(response.latitude);
        console.log(response.longitude);
        userLongitude = response.longitude;
        userLatitude = response.latitude;
    });
// ________________________ // ________________________ // ________________________



getBeerList();
console.log(responseADDRESS);