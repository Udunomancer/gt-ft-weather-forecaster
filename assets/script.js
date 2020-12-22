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
    var weather = {
        city: "",
        latitude: "",
        longitute: "",
        currentWthr: {
            temperature: "",
            humidity: "",
            windSpeed: ""
        },
        uvIndex: "",
        fiveDayWthr: {},
        makeCurrentWthrURL: function() {
            return this.currentWthr.API.url + this.currentWthr.API.query + this.city + this.APIKey;
        },
        makeUVIndexURL: function() {

        },
        makeFiveDayURL: function() {

        },
        callAPI: function(calledURL, action) {
            $.ajax({
                url: calledURL,
                method: "GET"
            }).then(action(response))
        },
        setCurrentWthr: function(response) {
            this.currentWthr.temperature = response.main.temp;
            this.currentWthr.humidity = response.main.humidity;
            this.currentWthr.windSpeed = response.wind.speed;
        },
        displayWthr: function() {
            currentWthrEl.removeClass("visually-hidden")
            currentWthrCityEl.text(this.city);
            currentWthrTempEl.text("Temperature: " + this.currentWthr.temperature);
            currentWthrHumidEl.text("Humidity: " + this.currentWthr.humidity);
            currentWthrWindEl.text("Wind Speed: " + this.currentWthr.windSpeed);
            console.log(response);
        }
    }
    // var currentWthrAPI = {
    //     url: "https://api.openweathermap.org/data/2.5/weather",
    //     query: "?q=",
    //     city: "",
    //     APIKey: "&appid=9bd6449387a57e80b45791c32b2fb94a",
    //     getWeather: function(newCity) {
    //         this.city = newCity;
    //         return this.url + this.query + this.city + this.APIKey;
    //     }
    // }
    // var uvAPI = {
    //     url: "https://api.openweathermap.org/data/2.5/uvi",
    //     latQ: "?lat=",
    //     latitude: "",
    //     lonQ: "?lon=",
    //     APIKey: "&appid=9bd6449387a57e80b45791c32b2fb94a"
    // }
   
    

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
        fiveDayDisplayEl.children().each(function() {
            $(this).text("Test");
        });
    }

    function citySearch(event) {
        
        event.preventDefault();

        //Need this?
        //clear();

        city = $("#city").val().trim();

        $.ajax({
            url: buildURL("current"),
            method: "GET"
        }).then(updateCurrentWeather);

        $.ajax({
            url: buildURL("fiveDay"),
            method: "GET"
        }).then(updateFiveDayWeather);
        
        
        // $.ajax({
        //     //url: queryURL,
        //     url: "https://api.openweathermap.org/data/2.5/forecast?q=" + $("#city").val().trim() + "&appid=9bd6449387a57e80b45791c32b2fb94a",
        //     method: "GET"
        // }).then(function(response) {
        //     console.log(response);
        //     //displayCurrentWthr(response);
        //     // $.ajax({

        //     // })
        // })
    }

    // function displayCurrentWthr(response) {
    //     currentWthrEl.removeClass("visually-hidden")
    //     currentWthrCityEl.text(response.name);
    //     currentWthrTempEl.text("Temperature: " + response.main.temp);
    //     currentWthrHumidEl.text("Humidity: " + response.main.humidity);
    //     currentWthrWindEl.text("Wind Speed: " + response.wind.speed);
    //     console.log(response);
    // }

    // ===FUNCTION CALLS===

    // ===EVENT LISTENERS===
    $("#city-search").on("submit", citySearch)
});