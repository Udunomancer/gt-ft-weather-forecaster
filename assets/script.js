$(document).ready(function() {
    // ===DOM VARIABLES===
    var currentWthrEl = $("#current-weather")
    var currentWthrCityEl = $("#current-weather-city");
    var currentWthrTempEl = $("#current-weather-temperature");
    var currentWthrHumidEl = $("#current-weather-humidity");
    var currentWthrWindEl = $("#current-weather-wind-speed");
    var currentWthrUVEl = $("#current-weather-uv-index");

    // ===JS VARIABLES===
    var currentWthrAPI = "https://api.openweathermap.org/data/2.5/weather?q="
    var APIKey = "&appid=9bd6449387a57e80b45791c32b2fb94a";
    

    // ===FUNCTION DEFINITIONS===
    function citySearch(event) {
        event.preventDefault();
        var city = $("#city").val().trim();
        var queryURL = currentWthrAPI + city + APIKey;
        
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
        })
    }

    function displayCurrentWthr() {
        currentWthrEl.removeClass("visually-hidden")
        currentWthrCityEl.text()
    }


    // ===FUNCTION CALLS===
    // $.ajax({
    //     url: "https://api.openweathermap.org/data/2.5/weather?q=Atlanta&appid=9bd6449387a57e80b45791c32b2fb94a",
    //     method: "GET"
    // }).then(function(response) {
    //     console.log(response);
    // })

    // ===EVENT LISTENERS===
    $("#city-search").on("submit", citySearch)
});