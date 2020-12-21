$(document).ready(function() {
    // ===DOM VARIABLES===
    var currentWthrEl = $("#current-weather")
    var currentWthrCityEl = $("#current-weather-city");
    var currentWthrTempEl = $("#current-weather-temperature");
    var currentWthrHumidEl = $("#current-weather-humidity");
    var currentWthrWindEl = $("#current-weather-wind-speed");
    var currentWthrUVEl = $("#current-weather-uv-index");

    // ===JS VARIABLES===
    var weather = {
        APIKey: "&appid=9bd6449387a57e80b45791c32b2fb94a",
        city: "",
        latitude: "",
        longitute: "",
        currentWthr: {
            API: {
                url: "https://api.openweathermap.org/data/2.5/weather",
                query: "?q="
            },
            temperature: "",
            humidity: "",
            windSpeed: ""
        },
        uvIndex: {
            API: {
            url: "https://api.openweathermap.org/data/2.5/uvi",
            latQ: "?lat=",
            lonQ: "?lon=",
            },
            uvIndex: ""
        },
        makeCurrentWthrURL: function() {
            return this.currentWthr.API.url + this.currentWthr.API.query + this.city + this.APIKey;
        },
        makeUVIndexURL: function() {

        },
        makeFiveDayURL: function() {

        },
        callAPI: function(calledURL) {
            $.ajax({
                url: calledURL,
                method: "GET"
            })
        },
        setCurrentWthr: function(response) {
            this.city = response.name;
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
    function citySearch(event) {
        event.preventDefault();
        weather.city = $("#city").val().trim();
        
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            displayCurrentWthr(response);
            // $.ajax({

            // })
        })
    }

    function displayCurrentWthr(response) {
        currentWthrEl.removeClass("visually-hidden")
        currentWthrCityEl.text(response.name);
        currentWthrTempEl.text("Temperature: " + response.main.temp);
        currentWthrHumidEl.text("Humidity: " + response.main.humidity);
        currentWthrWindEl.text("Wind Speed: " + response.wind.speed);
        console.log(response);
    }

    // ===FUNCTION CALLS===

    // ===EVENT LISTENERS===
    $("#city-search").on("submit", citySearch)
});