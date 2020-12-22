$(document).ready(function() {
    // ===DOM VARIABLES===
    var storedCitiesContainEl = $("#searched-cities");
    var currentWthrEl = $("#current-weather")
    var currentWthrCityEl = $("#current-weather-city");
    var currentWthrTempEl = $("#current-weather-temperature");
    var currentWthrHumidEl = $("#current-weather-humidity");
    var currentWthrWindEl = $("#current-weather-wind-speed");
    var currentWthrUVEl = $("#current-weather-uv-index");
    var currentWthrUVSpanEl = $("#current-weather-uv-num")
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
            queryParams.units = "imperial";
        }

        return queryURL + $.param(queryParams);
    }

    function updateCurrentWeather(weather) {
        
        //Make current weather panel visible
        currentWthrEl.removeClass("visually-hidden");

        var instanceDate = new Date();

        //Set city text on title
        currentWthrCityEl.text(weather.name + " (" + instanceDate.toLocaleDateString("en-US") + ")");
        currentWthrTempEl.html("Temperature: " + weather.main.temp + " &#176;F");
        currentWthrHumidEl.text("Humidity: " + weather.main.humidity + "%");
        currentWthrWindEl.text("Wind Speed: " + weather.wind.speed + " MPH");
        console.log(weather);

        $.ajax({
            url: buildURL("uv", weather.coord.lat, weather.coord.lon),
            method: "GET"
        }).then(function(response) {
            currentWthrUVEl.empty();
            currentWthrUVEl.text("UV Index: ");
            var uvSpanEl = $("<span>");
            uvSpanEl.text(response.value);
            if (response.value <= 2) {
                uvSpanEl.addClass("bg-success p-1 rounded").removeClass("bg-warning bg-orange bg-danger bg-purple");
            } else if (2 <response.value && response.value <= 5) {
                uvSpanEl.addClass("bg-warning p-1 rounded").removeClass("bg-success bg-orange bg-danger bg-purple")
            } else if (5 < response.value && response.value <= 7) {
                uvSpanEl.addClass("bg-orange p-1 rounded").removeClass("bg-success bg-warning bg-danger bg-purple")
            } else if (7 < response.value && response.value <= 10) {
                uvSpanEl.addClass("bg-danger text-white p-1 rounded").removeClass("bg-success bg-warning bg-orange bg-purple")
            } else {
                uvSpanEl.addClass("p-1 text-white rounded").removeClass("bg-success bg-warning bg-orange bg-danger")
                uvSpanEl.attr("style", "background-color: purple");
            }
            currentWthrUVEl.append(uvSpanEl);
        })
    }

    function updateFiveDayWeather(weather) {
        fiveDayContainEL.removeClass("visually-hidden");
        console.log(weather);
        var currentDayInArray = 3;
        fiveDayDisplayEl.children().each(function() {
            current = $(this);
            var instanceDate = new Date(weather.list[currentDayInArray].dt_txt);
            current.children(".date").text(instanceDate.toLocaleDateString("en-US"));
            current.children(".weather-icon").attr("src", makeIconURL(weather.list[currentDayInArray].weather[0].icon));
            current.children(".temp").html("Temp: " + weather.list[currentDayInArray].main.temp + " &#176;F");
            current.children(".humid").text("Humidity: " + weather.list[currentDayInArray].main.humidity + "%");
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