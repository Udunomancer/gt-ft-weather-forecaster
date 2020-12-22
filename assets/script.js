$(document).ready(function() {
    // ===DOM VARIABLES===
    var storedCitiesContainEl = $("#searched-cities");
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
    function init() {
        if (localStorage.getItem("searchedCitiesLS") !== null) {
            searchedCities = JSON.parse(localStorage.getItem("searchedCitiesLS"));
            
            displayStoredCities();
        }
    }

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
        
        //Make current weather panel visible
        currentWthrEl.removeClass("visually-hidden");

        //Set city text on title
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
            current.children(".weather-icon").attr("src", makeIconURL(weather.list[currentDayInArray].weather[0].icon));
            current.children(".temp").text("Temp: " + weather.list[currentDayInArray].main.temp);
            current.children(".humid").text("Humidity: " + weather.list[currentDayInArray].main.humidity);
            currentDayInArray = currentDayInArray + 8;
        });
    }

    function storeCities() {
        searchedCities.push(city);

        localStorage.setItem("searchedCitiesLS", JSON.stringify(searchedCities));

        storedCitiesContainEl.empty();

        displayStoredCities();
    }

    function displayStoredCities() {
        for (var i = 0; i < searchedCities.length; i++) {
            var cityItem = $("<li>");
            cityItem.text(searchedCities[i]);
            cityItem.addClass("list-group-item");
            cityItem.addClass("searched-city");
            cityItem.attr("data-city", searchedCities[i]);
            storedCitiesContainEl.prepend(cityItem);
        }
    }

    function makeIconURL(icon) {
        return "http://openweathermap.org/img/wn/" + icon + ".png";
    }

    function citySearch(event) {
        
        event.preventDefault();

        city = $("#search-city").val().trim();

        storeCities();

        $.ajax({
            url: buildURL("current"),
            method: "GET"
        }).then(updateCurrentWeather);

        $.ajax({
            url: buildURL("fiveDay"),
            method: "GET"
        }).then(updateFiveDayWeather);
    }

    function cityPull(event) {

        city = $(event.target).text();     

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
    init();


    // ===EVENT LISTENERS===
    $("#city-search").on("submit", citySearch);

    $("#searched-cities").on("click", cityPull);
});