$(document).ready(function() {
    // ===DOM VARIABLES===
    var currentWthrEl = $("#current-weather")
    var currentWthrCityEl = $("#current-weather-city");
    var currentWthrTempEl = $("#current-weather-temperature");
    var currentWthrHumidEl = $("#current-weather-humidity");
    var currentWthrWindEl = $("#current-weather-wind-speed");
    var currentWthrUVEl = $("#current-weather-uv-index");
    var fiveDayContainEL = $("#five-day");
    var fiveDayDisplayEl = $("#five-day-row");

    // ===JS VARIABLES===
    var urls = {
        current: "https://api.openweathermap.org/data/2.5/weather?",
        uv: "https://api.openweathermap.org/data/2.5/uvi?",
        fiveDay: "https://api.openweathermap.org/data/2.5/forecast?"
    }
    var apiKey = "9bd6449387a57e80b45791c32b2fb94a"
    var city;
    var searchedCities = [];

    // ===FUNCTION DEFINITIONS===
    function buildURL(type, latitude, longitude) {

        var queryURL = urls[type];

        var queryParams = { "appid":  apiKey };

        if (type === "uv") {
            queryParams.lat = latitude;
            queryParams.lon = longitude;
        } else {
            queryParams.q = city;
        }

        return queryURL + $.param(queryParams);
    }

    function updateCurrentWeather(weather) {
        
        currentWthrEl.removeClass("visually-hidden")
        currentWthrCityEl.text(weather.name);
        currentWthrTempEl.text("Temperature: " + weather.main.temp);
        currentWthrHumidEl.text("Humidity: " + weather.main.humidity);
        currentWthrWindEl.text("Wind Speed: " + weather.wind.speed);
        console.log(weather);

        $.ajax({
            url: buildURL("uv", weather.coord.lat, weather.coord.lon),
            method: "GET"
        }).then(function(response) {
            currentWthrUVEl.text("UV Index: " + response.value);
        })
        console.log(buildURL("uv"));
    }

    function updateFiveDayWeather(weather) {
        fiveDayContainEL.removeClass("visually-hidden");
        console.log(weather);
        var currentDayInArray = 3;
        fiveDayDisplayEl.children().each(function() {
            current = $(this);
            current.children(".date").text(weather.list[currentDayInArray].dt_txt);
            current.children(".temp").text("Temp: " + weather.list[currentDayInArray].main.temp);
            current.children(".humid").text("Humidity: " + weather.list[currentDayInArray].main.humidity);
            currentDayInArray = currentDayInArray + 8;
        });
    }

    function citySearch(event) {
        
        event.preventDefault();

        city = $("#city").val().trim();

        searchedCities.push(city);
        console.log(searchedCities);

        $.ajax({
            url: buildURL("current"),
            method: "GET"
        }).then(updateCurrentWeather);

        $.ajax({
            url: buildURL("fiveDay"),
            method: "GET"
        }).then(updateFiveDayWeather);
    }

    // ===FUNCTION CALLS===

    // ===EVENT LISTENERS===
    $("#city-search").on("submit", citySearch)
});