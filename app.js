const iconElement = document.querySelector('.weather-icon');
const locationElement = document.querySelector('.location p');
const tempElement = document.querySelector('.temperature-value p');
const notificationElement = document.querySelector('.notification');
const descElement = document.querySelector('.temperature-description');

const weather = {
  temperature: {
    unit: 'celsius',
  },
};

const KELVIN = 273;
const key = '82005d27a116c2880c8f0fcb866998a0';

'geolocation' in navigator
  ? navigator.geolocation.getCurrentPosition(setPosition, showError)
  : (notificationElement.style.display = 'block');
notificationElement.innerHTML = '<p>Browser does not support Geolocation</p>';

function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  getWeather(latitude, longitude);
}

function showError(error) {
  notificationElement.style.display = 'block';
  notificationElement.innerHTML = `<p>${error.message}</p>`;
}

const getWeather = (latitude, longitude) => {
  let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

  fetch(api)
    .then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {
      weather.city = data.name;
      weather.country = data.sys.country;
      weather.iconId = data.weather[0].icon;
      weather.description = data.weather[0].description;
      weather.temperature.value = Math.floor(data.main.temp - KELVIN);
    })
    .then(function () {
      displayWeather();
    });
};

const displayWeather = () => {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png" />`;
  tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;
};

const celsiusToFahrenheit = (temperature) => (temperature * 9) / 5 + 32;

tempElement.addEventListener('click', function () {
  if (weather.temperature.value === undefined) return;

  if (weather.temperature.unit == 'celsius') {
    let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
    fahrenheit = Math.floor(fahrenheit);

    tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
    weather.temperature.unit = 'fahrenheit';
  } else {
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    weather.temperature.unit = 'celsius';
  }
});
