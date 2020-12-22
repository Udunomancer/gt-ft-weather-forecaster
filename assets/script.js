$(document).ready(function () {
  // ===DOM VARIABLES===
  var storedCitiesContainEl = $("#searched-cities");
  var currentWthrEl = $("#current-weather");
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
    fiveDay: "https://api.openweathermap.org/data/2.5/forecast?",
  };
  var apiKey = "9bd6449387a57e80b45791c32b2fb94a";
  var city;
  var searchedCities = [];

  // ===FUNCTION DEFINITIONS===
  function init() {
    //Function to load local storage on page load
    //Input: none
    //Output: none

    if (localStorage.getItem("searchedCitiesLS") !== null) {
      searchedCities = JSON.parse(localStorage.getItem("searchedCitiesLS"));

      displayStoredCities();
    }
  }

  function buildURL(type, latitude, longitude) {
    //Function to build URLs for API calls
    //Input: API call type, latitude (for UV call) longitude (for UV call)
    //Output: URL for use with ajax

    var queryURL = urls[type];

    var queryParams = { appid: apiKey };

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
    //Function to update html with current weather elements and information
    //Input: weather information from API Call
    //Output: none

    //Make current weather panel visible
    currentWthrEl.removeClass("visually-hidden");

    var instanceDate = new Date();

    //Set city text on title
    currentWthrCityEl.html(
      weather.name + " (" + instanceDate.toLocaleDateString("en-US") + ")"
    );
    var icon = $("<span>");
    var iconImg = $("<img>");
    iconImg.attr("class", "img-fluid");
    iconImg.attr("src", makeIconURL(weather.weather[0].icon));
    icon.append(iconImg);
    currentWthrCityEl.append(icon);
    currentWthrTempEl.html("Temperature: " + weather.main.temp + " &#176;F");
    currentWthrHumidEl.text("Humidity: " + weather.main.humidity + "%");
    currentWthrWindEl.text("Wind Speed: " + weather.wind.speed + " MPH");
    console.log(weather);

    $.ajax({
      url: buildURL("uv", weather.coord.lat, weather.coord.lon),
      method: "GET",
    }).then(function (response) {
      currentWthrUVEl.empty();
      currentWthrUVEl.text("UV Index: ");
      var uvSpanEl = $("<span>");
      uvSpanEl.text(response.value);
      if (response.value <= 3) {
        uvSpanEl.addClass("bg-success p-1 rounded");
      } else if (3 < response.value && response.value <= 7) {
        uvSpanEl.addClass("bg-warning p-1 rounded");
      } else {
        uvSpanEl.addClass("bg-danger text-white p-1 rounded");
      }
      currentWthrUVEl.append(uvSpanEl);
    });
  }

  function updateFiveDayWeather(weather) {
    //Function to update the five day forecast
    //Input: Weather information from API call
    //Output: none

    fiveDayContainEL.removeClass("visually-hidden");
    console.log(weather);
    var currentDayInArray = 3;
    fiveDayDisplayEl.children().each(function () {
      current = $(this);
      var instanceDate = new Date(weather.list[currentDayInArray].dt_txt);
      current.children(".date").text(instanceDate.toLocaleDateString("en-US"));
      current
        .children(".weather-icon")
        .attr(
          "src",
          makeIconURL(weather.list[currentDayInArray].weather[0].icon)
        );
      current
        .children(".temp")
        .html(
          "Temp: " + weather.list[currentDayInArray].main.temp + " &#176;F"
        );
      current
        .children(".humid")
        .text(
          "Humidity: " + weather.list[currentDayInArray].main.humidity + "%"
        );
      currentDayInArray = currentDayInArray + 8;
    });
  }

  function storeCities() {
    //Function to store a searched city in variable and local storage
    //Input: none
    //Output: none
    var newCity = true;
    for (var i = 0; i < searchedCities.length; i++) {
      if (city.toLowerCase() === searchedCities[i].toLowerCase()) {
        newCity = false;
      }
    }

    if (newCity === true) {
      searchedCities.push(city);

      localStorage.setItem("searchedCitiesLS", JSON.stringify(searchedCities));

      storedCitiesContainEl.empty();

      displayStoredCities();
    }
  }

  function displayStoredCities() {
    //Function to searched display cities stored in variable array
    //Input: none
    //Output: none

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
    //Function to build the src link for weather icons
    //Input: icon code from API call
    //Output: url for use with an image src

    return "http://openweathermap.org/img/wn/" + icon + ".png";
  }

  function citySearch(event) {
    //Function to kick off items when city is searched
    //Input: Event
    //Output: none

    event.preventDefault();

    if ($("#search-city").val() !== "") {
      city = $("#search-city").val().trim();

      storeCities();

      $.ajax({
        url: buildURL("current"),
        method: "GET",
      }).then(updateCurrentWeather);

      $.ajax({
        url: buildURL("fiveDay"),
        method: "GET",
      }).then(updateFiveDayWeather);
    }
  }

  function cityPull(event) {
    //Function to kick off items from a saved city click
    //Input: Event
    //Output: none

    city = $(event.target).text();

    $.ajax({
      url: buildURL("current"),
      method: "GET",
    }).then(updateCurrentWeather);

    $.ajax({
      url: buildURL("fiveDay"),
      method: "GET",
    }).then(updateFiveDayWeather);
  }

  // ===FUNCTION CALLS===
  //Calling init function on page load
  init();

  // ===EVENT LISTENERS===
  //Event listener on search
  $("#city-search").on("submit", citySearch);

  //Event listener for saved cities
  $("#searched-cities").on("click", cityPull);
});
