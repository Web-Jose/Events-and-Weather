// Date on .date
const CurrentDate = new Date();
const date = CurrentDate.getDate();
const month = CurrentDate.getMonth();
const year = CurrentDate.getFullYear();
const months = [
  "January",
  "Febuary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "Decemeber",
];
document.querySelector(".date").innerHTML =
  months[month] + " " + date + ", " + year;

// Weather using Weather API
document.addEventListener("DOMContentLoaded", function () {
  fetchWeatherData();
});

function fetchWeatherData() {
  const apiKey = "9226554d185a4becb47223723231812";
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=Fresno&days=2&aqi=yes&alerts=yes`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => updateWeatherDisplay(data))
    .catch((error) => console.error("Error fetching weather data:", error));
}

function updateWeatherDisplay(data) {
  const todayForecast = data.forecast.forecastday[0].hour;
  const tomorrowForecast = data.forecast.forecastday[1].hour;

  updateWeatherInfo(todayForecast, 9, "morning");
  updateWeatherInfo(todayForecast, 16, "afternoon");
  updateWeatherInfo(todayForecast, 21, "evening");
  updateWeatherInfo(tomorrowForecast, 3, "overnight");
}

function updateWeatherInfo(forecast, hour, period) {
  const weatherData = forecast.find(
    (h) => new Date(h.time).getHours() === hour
  );

  if (!weatherData) return;

  // Update primary weather information
  const container = document.querySelector(`.${period} .weather`);
  const icon = container.querySelector(".weather-icon i");
  const temp = container.querySelector(".weather-temp");

  icon.className = ""; // Clear existing classes
  icon.classList.add(
    "wi",
    getWeatherIconClass(weatherData.condition.code, weatherData.is_day)
  );
  temp.innerHTML = `${Math.round(weatherData.temp_f)}&deg; <span>F</span>`;

  temp.innerHTML = `${Math.round(weatherData.temp_f)}&deg; <span>F</span>`;

  // Update secondary weather information based on condition
  const secondaryContainer = document.querySelector(
    `.${period} .secondary-condition`
  );
  let secondaryInfo = "";
  if (weatherData.will_it_rain == 1) {
    secondaryInfo = `<i class="wi wi-raindrops"></i> ${weatherData.chance_of_rain}% Chance of Rain`;
  } else if (weatherData.condition.text.toLowerCase().includes("fog")) {
    secondaryInfo = `Visibility: ${weatherData.vis_km} km`;
  } else if (
    weatherData.air_quality &&
    weatherData.air_quality["us-epa-index"] > 2
  ) {
    let airQualityTitle;
    switch (weatherData.air_quality["us-epa-index"]) {
      case 3:
        airQualityTitle = "Unhealthy for Sensitive Groups";
        break;
      case 4:
        airQualityTitle = "Unhealthy";
        break;
      case 5:
        airQualityTitle = "Very Unhealthy";
        break;
      case 6:
        airQualityTitle = "Hazardous";
        break;
      default:
        airQualityTitle = "Poor";
        break;
    }
    secondaryInfo = `Air Quality: ${airQualityTitle} (AQI: ${weatherData.air_quality["us-epa-index"]})`;
  } else if (weatherData.alerts && weatherData.alerts.length > 0) {
    // Assuming alerts is an array of alert objects
    secondaryInfo = `Alert: ${weatherData.alerts[0].headline}`;
  } else {
    secondaryInfo = `Feels like: ${Math.round(
      weatherData.feelslike_f
    )}° <span>F</span>`;
  }

  secondaryContainer.innerHTML = secondaryInfo;
}

function getWeatherIconClass(conditionCode, isDay) {
  if (isDay == 1) {
    switch (conditionCode) {
      case 1000:
        return "wi-day-sunny"; // For Sunny or Clear
      case 1003:
        return "wi-day-cloudy"; // For Partly cloudy
      case 1006:
        return "wi-cloud"; // For Cloudy
      case 1009:
        return "wi-cloudy"; // For Overcast
      case 1030:
        return "wi-day-fog"; // For Mist
      case 1063:
        return "wi-day-showers"; // For Patchy rain possible
      case 1066:
        return "wi-day-snow"; // For Patchy snow possible
      case 1069:
        return "wi-day-sleet"; // For Patchy sleet possible
      case 1072:
        return "wi-day-sprinkle"; // For Patchy freezing drizzle possible
      case 1087:
        return "wi-day-thunderstorm"; // For Thundery outbreaks possible
      case 1114:
        return "wi-day-snow-wind"; // For Blowing snow
      case 1117:
        return "wi-snow-wind"; // For Blizzard
      case 1135:
        return "wi-day-fog"; // For Fog
      case 1147:
        return "wi-fog"; // For Freezing fog
      case 1150:
        return "wi-day-sprinkle"; // For Patchy light drizzle
      case 1153:
        return "wi-sprinkle"; // For Light drizzle
      case 1168:
        return "wi-day-rain-mix"; // For Freezing drizzle
      case 1171:
        return "wi-rain-mix"; // For Heavy freezing drizzle
      case 1180:
        return "wi-day-showers"; // For Patchy light rain
      case 1183:
        return "wi-showers"; // For Light rain
      case 1186:
        return "wi-day-rain"; // For Moderate rain at times
      case 1189:
        return "wi-day-rain"; // For Moderate rain
      case 1192:
        return "wi-rain"; // For Heavy rain at times
      case 1195:
        return "wi-rain"; // For Heavy rain
      case 1198:
        return "wi-day-rain-mix"; // For Light freezing rain
      case 1201:
        return "wi-rain-mix"; // For Moderate or heavy freezing rain
      case 1204:
        return "wi-day-sleet"; // For Light sleet
      case 1207:
        return "wi-sleet"; // For Moderate or heavy sleet
      case 1210:
        return "wi-snow"; // For Patchy light snow
      case 1213:
        return "wi-snow"; // For Light snow
      case 1216:
        return "wi-day-snow"; // For Patchy moderate snow
      case 1219:
        return "wi-day-snow"; // For Moderate snow
      case 1222:
        return "wi-snow"; // For Patchy heavy snow
      case 1225:
        return "wi-snow"; // For Heavy snow
      case 1237:
        return "wi-day-hail"; // For Ice pellets
      case 1240:
        return "wi-day-showers"; // For Light rain shower
      case 1243:
        return "wi-showers"; // For Moderate or heavy rain shower
      case 1246:
        return "wi-rain"; // For Torrential rain shower
      case 1249:
        return "wi-sleet"; // For Light sleet showers
      case 1252:
        return "wi-sleet"; // For Moderate or heavy sleet showers
      case 1255:
        return "wi-day-snow"; // For Light snow showers
      case 1258:
        return "wi-snow"; // For Moderate or heavy snow showers
      case 1261:
        return "wi-hail"; // For Light showers of ice pellets
      case 1264:
        return "wi-day-hail"; // For Moderate or heavy showers of ice pellets
      case 1273:
        return "wi-day-storm-showers"; // For Patchy light rain with thunder
      case 1276:
        return "wi-thunderstorm"; // For Moderate or heavy rain with thunder
      case 1279:
        return "wi-storm-showers"; // For Patchy light snow with thunder
      case 1282:
        return "wi-storm-showers"; // For Moderate or heavy snow with thunder
      default:
        return "wi-na"; // Default icon if no match is found
    }
  } else {
    switch (conditionCode) {
      case 1000:
        return "wi-night-clear"; // For Sunny or Clear
      case 1003:
        return "wi-night-alt-cloudy"; // For Partly cloudy
      case 1006:
        return "wi-cloud"; // For Cloudy
      case 1009:
        return "wi-cloudy"; // For Overcast
      case 1030:
        return "wi-night-fog"; // For Mist
      case 1063:
        return "wi-night-alt-showers"; // For Patchy rain possible
      case 1066:
        return "wi-night-alt-snow"; // For Patchy snow possible
      case 1069:
        return "wi-night-alt-sleet"; // For Patchy sleet possible
      case 1072:
        return "wi-night-alt-sprinkle"; // For Patchy freezing drizzle possible
      case 1087:
        return "wi-night-alt-thunderstorm"; // For Thundery outbreaks possible
      case 1114:
        return "wi-night-snow-wind"; // For Blowing snow
      case 1117:
        return "wi-snow-wind"; // For Blizzard
      case 1135:
        return "wi-night-fog"; // For Fog
      case 1147:
        return "wi-fog"; // For Freezing fog
      case 1150:
        return "wi-night-alt-sprinkle"; // For Patchy light drizzle
      case 1153:
        return "wi-sprinkle"; // For Light drizzle
      case 1168:
        return "wi-night-alt-rain-mix"; // For Freezing drizzle
      case 1171:
        return "wi-rain-mix"; // For Heavy freezing drizzle
      case 1180:
        return "wi-night-alt-showers"; // For Patchy light rain
      case 1183:
        return "wi-showers"; // For Light rain
      case 1186:
        return "wi-night-alt-rain"; // For Moderate rain at times
      case 1189:
        return "wi-night-alt-rain"; // For Moderate rain
      case 1192:
        return "wi-rain"; // For Heavy rain at times
      case 1195:
        return "wi-rain"; // For Heavy rain
      case 1198:
        return "wi-night-alt-rain-mix"; // For Light freezing rain
      case 1201:
        return "wi-rain-mix"; // For Moderate or heavy freezing rain
      case 1204:
        return "wi-night-alt-sleet"; // For Light sleet
      case 1207:
        return "wi-sleet"; // For Moderate or heavy sleet
      case 1210:
        return "wi-snow"; // For Patchy light snow
      case 1213:
        return "wi-snow"; // For Light snow
      case 1216:
        return "wi-night-alt-snow"; // For Patchy moderate snow
      case 1219:
        return "wi-night-alt-snow"; // For Moderate snow
      case 1222:
        return "wi-snow"; // For Patchy heavy snow
      case 1225:
        return "wi-snow"; // For Heavy snow
      case 1237:
        return "wi-hail"; // For Ice pellets
      case 1240:
        return "wi-night-alt-showers"; // For Light rain shower
      case 1243:
        return "wi-showers"; // For Moderate or heavy rain shower
      case 1246:
        return "wi-rain"; // For Torrential rain shower
      case 1249:
        return "wi-sleet"; // For Light sleet showers
      case 1252:
        return "wi-sleet"; // For Moderate or heavy sleet showers
      case 1255:
        return "wi-night-alt-snow"; // For Light snow showers
      case 1258:
        return "wi-snow"; // For Moderate or heavy snow showers
      case 1261:
        return "wi-hail"; // For Light showers of ice pellets
      case 1264:
        return "wi-night-alt-hail"; // For Moderate or heavy showers of ice pellets
      case 1273:
        return "wi-night-alt-storm-showers"; // For Patchy light rain with thunder
      case 1276:
        return "wi-thunderstorm"; // For Moderate or heavy rain with thunder
      case 1279:
        return "wi-storm-showers"; // For Patchy light snow with thunder
      case 1282:
        return "wi-storm-showers"; // For Moderate or heavy snow with thunder
      default:
        return "wi-na"; // Default icon if no match is found
    }
  }
}

// Time on .clock
const clock = document.querySelector(".clock");
const tick = () => {
  const now = new Date();
  let h = now.getHours();
  if (h === 0) {
    h = 12;
  } else if (h > 12) {
    h = h % 12;
  }
  const m = String(now.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const html = `
        ${h}:${m} <span>${ampm}</span>
        `;
  clock.innerHTML = html;
};
setInterval(tick, 1000);
