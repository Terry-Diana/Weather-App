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

const kelvin = 273;
const key = '82005d27a116c2880c8f0fcb866998a0';

if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  displayError('Browser does not support Geolocation');
}

function setPosition(position) {
  const { latitude, longitude } = position.coords;
  getWeather(latitude, longitude);
}

function showError(error) {
  notificationElement.style.display = 'block';
  notificationElement.innerHTML = `<p>${error.message}</p>`;
}

function getWeather(latitude, longitude) {
  const api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

  fetch(api)
    .then(function (response) {
      const data = response.json();
      return data;
    })
    .then(function (data) {
      weather.city = data.name;
      weather.country = data.sys.country;
      weather.iconId = data.weather[0].icon;
      weather.description = data.weather[0].description;
      weather.temperature.value = Math.floor(data.main.temp -kelvin);
    })
    .then(function () {
      displayWeather();
    });
};

function displayWeather () {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png" />`;
  tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;
};

function celsiusToFahrenheit(temperature) {
  (temperature * 9) / 5 + 32;
}

tempElement.addEventListener('click', function () {
  if (weather.temperature.value === undefined) return;

  if (weather.temperature.unit === 'celsius') {
    const fahrenheit = celsiusToFahrenheit(weather.temperature.value);
    fahrenheit = Math.floor(fahrenheit);

    tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
    weather.temperature.unit = 'fahrenheit';
  } else {
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    weather.temperature.unit = 'celsius';
  }
});
