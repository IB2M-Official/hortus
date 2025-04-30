// script.js

const locationInput = document.getElementById("location");
const dateSpan = document.getElementById("date");
const seasonSpan = document.getElementById("season");
const weatherSpan = document.getElementById("weather");
const calendarContainer = document.getElementById("calendarContainer");
const monthlyTips = document.getElementById("monthlyTips");
const aiAdvice = document.getElementById("aiAdvice");
const gardenNameInput = document.getElementById("gardenName");
const plantsInput = document.getElementById("plants");

const monthNames = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

const savedLocation = localStorage.getItem("location") || "Lyon";
locationInput.value = savedLocation;

// On charge l'app au démarrage
document.addEventListener("DOMContentLoaded", async () => {
  updateDateUI();
  await updateWeatherAndCalendar(savedLocation);
  displayMonthlyTips();
  getMistralAdvice();
});

document.getElementById("saveSettings").addEventListener("click", async () => {
  const location = locationInput.value;
  localStorage.setItem("location", location);
  await updateWeatherAndCalendar(location);
});

function updateDateUI() {
  const today = new Date();
  dateSpan.textContent = today.toLocaleDateString('fr-FR');
  seasonSpan.textContent = getSeason(today.getMonth());
}

function getSeason(month) {
  if ([11, 0, 1].includes(month)) return "Hiver";
  if ([2, 3, 4].includes(month)) return "Printemps";
  if ([5, 6, 7].includes(month)) return "Été";
  return "Automne";
}

async function updateWeatherAndCalendar(location) {
  try {
    const coords = await getCoordinates(location);
    const weatherData = await getWeatherForecast(coords.latitude, coords.longitude);
    displayWeatherInCalendar(weatherData);
    const todayIndex = new Date().getDate() - 1;
    const temp = `${weatherData.temperature_2m_min[todayIndex]}°C - ${weatherData.temperature_2m_max[todayIndex]}°C`;
    weatherSpan.textContent = `${temp} à ${location}`;
  } catch (e) {
    weatherSpan.textContent = "(Erreur météo)";
    console.error(e);
  }
}

async function getCoordinates(location) {
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`);
  const data = await res.json();
  if (data.results.length > 0) {
    return {
      latitude: data.results[0].latitude,
      longitude: data.results[0].longitude
    };
  } else {
    throw new Error("Localisation introuvable");
  }
}

async function getWeatherForecast(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_min,temperature_2m_max,weathercode&timezone=Europe%2FParis`;
  const res = await fetch(url);
  return (await res.json()).daily;
}

function displayWeatherInCalendar(dailyData) {
  calendarContainer.innerHTML = "";
  const days = dailyData.time.length;

  for (let i = 0; i < days; i++) {
    const date = new Date(dailyData.time[i]);
    const day = date.getDate();
    const month = date.toLocaleString('fr-FR', { month: 'long' });
    const tempMin = dailyData.temperature_2m_min[i];
    const tempMax = dailyData.temperature_2m_max[i];
    const weatherCode = dailyData.weathercode[i];

    const card = document.createElement("div");
    card.className = "day-card";
    card.style.backgroundImage = `url('assets/icons/${getWeatherIcon(weatherCode)}')`;
    card.style.backgroundSize = 'cover';
    card.style.backgroundPosition = 'center';
    card.innerHTML = `
      <h4>${day} ${month}</h4>
      <span class="temperature">${tempMin}°C - ${tempMax}°C</span>
    `;
    calendarContainer.appendChild(card);
  }
}

function getWeatherIcon(code) {
  const icons = {
    0: "https://github.com/manifestinteractive/weather-underground-icons/tree/master/dist/icons/black/png/64x64/sunny.png",
    1: "https://github.com/manifestinteractive/weather-underground-icons/tree/master/dist/icons/black/png/64x64/partly_cloudy.png",
    2: "https://github.com/manifestinteractive/weather-underground-icons/tree/master/dist/icons/black/png/64x64/cloudy.png",
    3: "https://github.com/manifestinteractive/weather-underground-icons/tree/master/dist/icons/black/png/64x64/mostlycloudy.png",
    45: "https://github.com/manifestinteractive/weather-underground-icons/tree/master/dist/icons/black/png/64x64/fog.png",
    48: "https://github.com/manifestinteractive/weather-underground-icons/tree/master/dist/icons/black/png/64x64/fog.png",
    51: "https://github.com/manifestinteractive/weather-underground-icons/tree/master/dist/icons/black/png/64x64/sleet.png",
    53: "https://github.com/manifestinteractive/weather-underground-icons/tree/master/dist/icons/black/png/64x64/sleet.png",
    55: "https://github.com/manifestinteractive/weather-underground-icons/tree/master/dist/icons/black/png/64x64/sleet.png",
    61: "https://github.com/manifestinteractive/weather-underground-icons/tree/master/dist/icons/black/png/64x64/rain.png",
    63: "https://github.com/manifestinteractive/weather-underground-icons/tree/master/dist/icons/black/png/64x64/rain.png",
    65: "https://github.com/manifestinteractive/weather-underground-icons/tree/master/dist/icons/black/png/64x64/rain.png",
    71: "https://github.com/manifestinteractive/weather-underground-icons/tree/master/dist/icons/black/png/64x64/snow.png",
    73: "https://github.com/manifestinteractive/weather-underground-icons/tree/master/dist/icons/black/png/64x64/snow.png",
    75: "https://github.com/manifestinteractive/weather-underground-icons/tree/master/dist/icons/black/png/64x64/snow.png",
    80: "https://github.com/manifestinteractive/weather-underground-icons/tree/master/dist/icons/black/png/64x64/chancerain.png",
    81: "https://github.com/manifestinteractive/weather-underground-icons/tree/master/dist/icons/black/png/64x64/chancerain.png",
    82: "https://github.com/manifestinteractive/weather-underground-icons/tree/master/dist/icons/black/png/64x64/chancerain.png",
    95: "https://github.com/manifestinteractive/weather-underground-icons/tree/master/dist/icons/black/png/64x64/tstorms.png",
    96: "https://github.com/manifestinteractive/weather-underground-icons/tree/master/dist/icons/black/png/64x64/tstorms.png",
    99: "https://github.com/manifestinteractive/weather-underground-icons/tree/master/dist/icons/black/png/64x64/tstorms.png"
  };
  return icons[code] || "https://github.com/manifestinteractive/weather-underground-icons/tree/master/dist/icons/black/png/64x64/unknown.png";
}

function displayMonthlyTips() {
  const month = new Date().toLocaleString('fr-FR', { month: 'long' });
  const tips = plantingCalendar[month];
  monthlyTips.innerHTML = `
    <p><strong>Semis :</strong> ${tips.semis.join(', ')}</p>
    <p><strong>Plantations :</strong> ${tips.plantation.join(', ')}</p>
    <p><strong>Récolte :</strong> ${tips.recolte.join(', ')}</p>
  `;
}

function getMistralAdvice() {
  const gardenName = gardenNameInput.value || "mon jardin";
  const plants = plantsInput.value || "tomates, salades";

  fetchMistralAI(`Que dois-je faire aujourd'hui dans ${gardenName} avec ${plants}?`)
    .then(response => {
      aiAdvice.textContent = response;
    })
    .catch(() => {
      aiAdvice.textContent = "(Erreur IA)";
    });
}
