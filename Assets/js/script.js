var searchBoxEl = document.querySelector('#search-form');
var previousSearchEl = document.getElementById('#previoussearch');
var searchInputVal = document.querySelector('#search-input');

apikey = 'bff7f172d54c9090fd530264d808d798';

function handleSearchSubmit(event) {
    event.preventDefault();

    //var searchInputVal = document.querySelector('#search-input');

    if (!searchInputVal) {
        console.error('You need a search input value!');
        return;
    }
    var city = searchInputVal.value.trim();
    var citiesList = JSON.parse(localStorage.getItem("previousCities"));
    citiesList.reverse();
    citiesList.push(city);
    citiesList.reverse();
    localStorage.setItem("previousCities", JSON.stringify(citiesList));
    getPreviousSearches();
    getWeatherData(city);
}

async function getWeatherData(cityName){
    let coordByLocation = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apikey}`;
    let coordForCity = await fetch(coordByLocation);
    let response = await coordForCity.json();
    // grab the long and lat of the first object as it's the most probable
    let lon = JSON.stringify(response[0]['lon']);
    let lat = JSON.stringify(response[0]['lat']);
    let forecastApi = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}`;
    let forecast = await fetch(forecastApi);
    let responsefc = await forecast.json();
    console.log(JSON.stringify(responsefc));
}

function getPreviousSearches() {
    if ((localStorage.getItem("previousCities"))===null) {
        var citiesList = [];
        localStorage.setItem("previousCities", JSON.stringify(citiesList));
    } else {
        var citiesList = JSON.parse(localStorage.getItem("previousCities"));
    }
    $("#sidebar ul li").empty();
    for (let i = 0; i < citiesList.length; i++) {
        $("#sidebar ul").append(`<li>${citiesList[i]}</li>`);
    }
}

getPreviousSearches();
searchBoxEl.addEventListener('submit', handleSearchSubmit);