$(document).ready(function() {
    // ===DOM VARIABLES===

    // ===JS VARIABLES===
    var currentWthrAPI = "api.openweathermap.org/data/2.5/weather?q="
    var APIKey = "&appid=9bd6449387a57e80b45791c32b2fb94a";
    

    // ===FUNCTION DEFINITIONS===
    function citySearch(event) {
        event.preventDefault();
        console.log($("#city").val().trim());
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