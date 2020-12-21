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
            displayCurrentWthr(response);
        })
    }

    function displayCurrentWthr(response) {
        currentWthrEl.removeClass("visually-hidden")
        currentWthrCityEl.text(response.name);
        currentWthrTempEl.text("Temperature: " + response.main.temp);
        currentWthrHumidEl.text("Humidity: " + response.main.humidity);
        currentWthrWindEl.text("Wind Speed: " + response.wind.speed);
    }

    // ===FUNCTION CALLS===

    // ===EVENT LISTENERS===
    $("#city-search").on("submit", citySearch)
});