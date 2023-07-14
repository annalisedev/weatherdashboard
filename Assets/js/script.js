var searchBoxEl = document.querySelector('#search-form');
var previousSearchEl = document.getElementById('#previoussearch');
var searchInputVal = document.querySelector('#search-input');
var currentInfoEl = $('#currentinfo');
var forecastEl = $('#forecast');
var forcastCardEl = $('#forecast-card');

apikey = 'bff7f172d54c9090fd530264d808d798';

$(document).ready(function () {
    forecastEl.empty();
    document.getElementById('currentinfo').style.display = 'none';
});

function handleSearchSubmit(event) {
    event.preventDefault();
    forecastEl.empty();

    //var searchInputVal = document.querySelector('#search-input');
    if (!searchInputVal) {
        console.error('You need a search input value!');
        return;
    }
    var city = searchInputVal.value.trim();
    var citiesList = JSON.parse(localStorage.getItem("previousCities"));

    // Check if the city already exists in the list
    if (citiesList && citiesList.includes(city)) {
        // Remove the existing city from the list
        citiesList = citiesList.filter(item => item !== city);
    }

    citiesList.reverse();
    citiesList.push(city);
    citiesList.reverse();
    localStorage.setItem("previousCities", JSON.stringify(citiesList));
    getPreviousSearches();
    getWeatherData(city);
}

//function to call API and pull city information for forecast and current weather information
async function getWeatherData(cityName){
    let coordByLocation = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apikey}`;
    let coordForCity = await fetch(coordByLocation);
    let response = await coordForCity.json();
    // grab the long and lat of the first object as it's the most probable
    let lon = JSON.stringify(response[0]['lon']);
    let lat = JSON.stringify(response[0]['lat']);
    let forecastApi = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`;
    let forecast = await fetch(forecastApi);
    let responsefc = await forecast.json();

    for (let i = 0; i <= 5; i++) {
        //first statement i=0 refers to current day information for top box
        if (i === 0){
            var daycount = 0;
            let responsetime = responsefc['list'][daycount]['dt'];
            var daytemp = responsefc['list'][daycount]['main']['temp'];
            var daywind = responsefc['list'][daycount]['wind']['speed'];
            var dayhum = responsefc['list'][daycount]['main']['humidity'];
            var dayicon = responsefc['list'][daycount]['weather'][0]['icon'];
            currentInfoEl.children('h2').text(cityName + ' ' + dayjs.utc(responsetime * 1000).format(`(DD/MM/YYYY)`));
            currentInfoEl.children('img').attr('src', `https://openweathermap.org/img/wn/${dayicon}@2x.png`);
            currentInfoEl.children('p').eq(0).text('Temp: ' + daytemp + "ºC");
            currentInfoEl.children('p').eq(1).text('Wind: ' + daywind + 'km/h');
            currentInfoEl.children('p').eq(2).text('Humidity: ' + dayhum + '%');
            document.getElementById('currentinfo').style.display = 'block';
        } else {
            var daycount = (i * 8) - 1;
            let responsetime = responsefc['list'][daycount]['dt'];
            var daytemp = responsefc['list'][daycount]['main']['temp'];
            var daywind = responsefc['list'][daycount]['wind']['speed'];
            var dayhum = responsefc['list'][daycount]['main']['humidity'];
            var dayicon = responsefc['list'][daycount]['weather'][0]['icon'];
            forcastCardEl.children('div').children('h5').text(dayjs.utc(responsetime * 1000).format(`DD/MM/YYYY`));
            forcastCardEl.children('div').children('img').attr('src', `https://openweathermap.org/img/wn/${dayicon}@2x.png`);
            forcastCardEl.children('div').children('p').eq(0).text('Temp: ' + daytemp + "ºC");
            forcastCardEl.children('div').children('p').eq(1).text('Wind: ' + daywind + 'km/h');
            forcastCardEl.children('div').children('p').eq(2).text('Humidity: ' + dayhum + '%');
            forecastEl.append(forcastCardEl.clone());
        } 
    }
}

//function to pull searches from local storage
function getPreviousSearches() {
    if ((localStorage.getItem("previousCities"))===null) {
        var citiesList = [];
        localStorage.setItem("previousCities", JSON.stringify(citiesList));
    } else {
        var citiesList = JSON.parse(localStorage.getItem("previousCities"));
    }

    //clear searches before appending to avoid duplicates
    $("#sidebar ul").empty();

    for (let i = 0; i < citiesList.length; i++) {
        $("#sidebar ul").append(`<button>${citiesList[i]}</button>`);
    }
}

getPreviousSearches();
searchBoxEl.addEventListener('submit', handleSearchSubmit);

//function handling when user clicks previous searches
$(document).on('click', 'button', function(event) {
    var text = jQuery(this).text();
    forecastEl.empty();
    getWeatherData(text);
});