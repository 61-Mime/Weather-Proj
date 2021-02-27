/* jshint esversion: 8 */

// import {database} from '../index.js';

let nameVal = '';

if ('geolocation' in navigator) {
    console.log('geolocation available');
    navigator.geolocation.getCurrentPosition(async position => {

        const status = document.getElementById('status');

        const mapLink = document.getElementById('map-link');
        mapLink.href = '';
        mapLink.textContent = '';

        const name = document.getElementById('name');
        name.addEventListener('change', function() {
            nameVal = this.value;
            document.getElementById('submit').style.display = 'block';
            document.getElementById('showWeatherList').style.display = 'none';
            document.getElementById('weatherData').style.display = 'none';
            document.getElementById('weatherList').style.display = 'none';
            // document.getElementById('displayArrow').style.display = 'none';
        });

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        document.getElementById('latitude').textContent = lat;
        document.getElementById('longitude').textContent = lon;


        const button = document.getElementById("submit");
        button.onclick = async () => {

            document.getElementById('submit').style.display = 'none';
            document.getElementById('showWeatherList').style.display = 'inline-block';
            // document.getElementsById('displayArrow').style.display = 'inline-block';

            mapLink.href = `https://www.openstreetmap.org/#map=18/${lat}/${lon}`;
            mapLink.textContent = "Check your location";
            const data = {lat, lon, nameVal};
            const options = {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            };
            const response = await fetch('/api', options);
            const jsonResponse = await response.json();

            // In case it requires cors change this to a local endpoint, like below
            // const api_url = `weather/${lat},${lon}`;
            const api_url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=1bd8ce8dfcac55f8e10a4cf4d4f0243f`;
            const weather_url_response = await fetch(api_url);
            const jsonWeatherResponse = await weather_url_response.json();
            // location.replace('http://localhost:3000/weather');
            // console.log(jsonWeatherResponse);

            displayWeatherData(jsonWeatherResponse);
            const weatherData = document.getElementById('weatherData');
        };

        const displayButton = document.getElementById('showWeatherList');
        displayButton.onclick = () => {
            toggleWeatherList();
            if (displayButton.textContent === 'Show') {
                displayArrow.style.transform = 'rotate(135deg)';
            }

            else {
                displayArrow.style.transform = 'rotate(' + -(180) + 'deg)';
            }
        };

        const displayArrow = document.getElementById('displayArrow');
        displayArrow.onclick = () => {
            toggleWeatherList();

            // if (displayButton.textContent === 'Show') {
            //     displayArrow.style.transform = 'rotate(' + 90 + 'deg)';
            // }

            // else {
            //     displayArrow.style.transform = 'rotate(' + (-180) + 'deg)';
            // }
        };
    });
}
else {
    status.textContent = 'geolocation not available';
}

function displayWeatherData(jsonWeatherResponse) {
    document.getElementById('weatherName').textContent = jsonWeatherResponse.name;
    document.getElementById('weatherCountry').textContent = jsonWeatherResponse.sys.country;
    document.getElementById('weatherMain').textContent = jsonWeatherResponse.weather[0].main;
    document.getElementById('weatherDescription').textContent = jsonWeatherResponse.weather[0].description;
    document.getElementById('weatherTemp').textContent = kelvinToCelsius(jsonWeatherResponse.main.temp) + '° C';
    document.getElementById('weatherFeelsLike').textContent = kelvinToCelsius(jsonWeatherResponse.main.feels_like) + '° C';
    document.getElementById('weatherTempMin').textContent = kelvinToCelsius(jsonWeatherResponse.main.temp_min) + '° C';
    document.getElementById('weatherTempMax').textContent = kelvinToCelsius(jsonWeatherResponse.main.temp_max) + '° C';
    document.getElementById('weatherHumidity').textContent = jsonWeatherResponse.main.humidity;
    document.getElementById('weatherTimezone').textContent = jsonWeatherResponse.timezone;
}

function kelvinToCelsius(kelvin) {
    const celsius = kelvin-273.15;
    return celsius.toFixed(2);
}

function onSignIn (googleUser) {
    let profile = googleUser.getBasicProfile();
    document.getElementById('name').value = profile.getName();
    nameVal = profile.getName();
}

function toggleWeatherList () {
    let v = document.getElementById('displayArrow');
    let x = document.getElementById('weatherList');
    let y = document.getElementById('weatherData');
    let z = document.getElementById('showWeatherList');

    if(x.style.display === 'none'){
        z.value = 'Hide';
        z.style.display = 'inline-block';
        x.style.display = 'block';
        y.style.display = 'block';
        v.style.display = 'inline-block';
    }
    else {
        z.value = 'Show';
        z.style.display = 'inline-block';
        x.style.display = 'none';
        y.style.display = 'none';
        v.style.display = 'inline-block';
    }
}