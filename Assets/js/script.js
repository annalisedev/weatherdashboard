var searchBoxEl = document.querySelector('#search-form');
var previousSearchEl = document.getElementById('#previoussearch');
var searchInputVal = document.querySelector('#search-input');

function handleSearchSubmit(event) {
    event.preventDefault();

    //var searchInputVal = document.querySelector('#search-input');

    if (!searchInputVal) {
        console.error('You need a search input value!');
        return;
    }

    console.log(searchInputVal.value);

    
    var city = searchInputVal.value.trim();
 
    if ((localStorage.getItem("previousCities"))===null) {
        var citiesList = [];
    } else {
        var citiesList = JSON.parse(localStorage.getItem("previousCities"));
        citiesList.reverse();
    }
    citiesList.push(city);
    citiesList.reverse();
    localStorage.setItem("previousCities", JSON.stringify(citiesList));

    for (let i = 0; i < citiesList.length; i++) {
        $("#sidebar ul").append(`<li>${citiesList[i]}</li>`);
    }    
}










searchBoxEl.addEventListener('submit', handleSearchSubmit);