
let apiKey = "28969492ff334eb9a60dbb84e806f0c9";
let queryURL = "https://api.ipgeolocation.io/ipgeo?apiKey=" + apiKey;

$.ajax({
    url: queryURL,
    method: "GET"
})
    .then(function (response) {

        console.log(response);

        const longitude = response.longitude;
        const latitude = response.latitude;

        mapboxgl.accessToken = "pk.eyJ1IjoicmFza29nIiwiYSI6ImNrOXhvOTdleTA1bHozbXBtc3R0ZDVkODIifQ.706vwlV4IYaDY7ZTOLEt9w";

        let map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v10",
            center: [longitude, latitude],
            zoom: 12,
        })

        function getRoute(end) {
            let start = [longitude, latitude];
            let feedCoords = "https://api.mapbox.com/directions/v5/mapbox/cycling/" + start[0] + ","
                + start[1] + ";" + end[0] + "," + end[1] + "?steps=true&geometries=geojson&access_token="
                + mapboxgl.accessToken;
        }
    });