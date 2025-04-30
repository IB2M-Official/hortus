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
  gardenNameInput.value = localStorage.getItem("gardenName") || "";
  plantsInput.value = localStorage.getItem("plants") || "";

});

document.getElementById("saveSettings").addEventListener("click", async () => {
  const location = locationInput.value;
  localStorage.setItem("location", location);
  await updateWeatherAndCalendar(location);
  localStorage.setItem("gardenName", gardenNameInput.value);
  localStorage.setItem("plants", plantsInput.value);

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
    const today = new Date().toISOString().split('T')[0];
    const todayIndex = weatherData.time.findIndex(date => date === today);

    if (todayIndex !== -1) {
      const temp = `${weatherData.temperature_2m_min[todayIndex]}°C - ${weatherData.temperature_2m_max[todayIndex]}°C`;
      weatherSpan.textContent = `${temp} à ${location}`;
    } else {
      weatherSpan.textContent = `(Pas de température dispo pour aujourd'hui à ${location})`;
    }

    displayWeatherInCalendar(weatherData);
    displayMonthlyTips(); // rafraîchit les légumes aussi
    getMistralAdvice(weatherData, todayIndex); // météo + légumes dans les conseils IA
  } catch (e) {
    weatherSpan.textContent = "(Erreur météo)";
    console.error(e);
  }
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
    const iconFile = getWeatherIcon(weatherCode);

    const card = document.createElement("div");
    card.className = "day-card";
    card.style.background = `url('${iconFile}') no-repeat center center`;
    card.style.backgroundSize = 'contain';
    card.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.justifyContent = "flex-end";
    card.style.padding = "8px";
    card.style.color = "white";
    card.style.textShadow = "1px 1px 3px #000";

    card.innerHTML = `
      <h4>${day} ${month}</h4>
      <span class="temperature">${tempMin}°C - ${tempMax}°C</span>
    `;
    calendarContainer.appendChild(card);
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



function getWeatherIcon(code) {
  const icons = {
    0: "assets/icons/sunny.png",
    1: "assets/icons/partly_cloudy.png",
    2: "assets/icons/cloudy.png",
    3: "assets/icons/mostlycloudy.png",
    45: "assets/icons/64x64/fog.png",
    48: "assets/icons/fog.png",
    51: "assets/icons/sleet.png",
    53: "assets/icons/sleet.png",
    55: "assets/icons/sleet.png",
    61: "assets/icons/rain.png",
    63: "assets/icons/rain.png",
    65: "assets/icons/rain.png",
    71: "assets/icons/snow.png",
    73: "assets/icons/snow.png",
    75: "assets/icons/snow.png",
    80: "assets/icons/chancerain.png",
    81: "assets/icons/chancerain.png",
    82: "assets/icons/chancerain.png",
    95: "assets/icons/tstorms.png",
    96: "assets/icons/tstorms.png",
    99: "assets/icons/tstorms.png"
  };
  return icons[code] || "assets/icons/unknown.png";
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

function getMistralAdvice(weatherData, todayIndex) {
  const gardenName = gardenNameInput.value || "mon jardin";
  const plants = plantsInput.value;

  // météo
  const todayCode = weatherData?.weathercode?.[todayIndex];
  const weatherIcon = getWeatherIcon(todayCode).replace(".png", "");
  const tempMin = weatherData?.temperature_2m_min?.[todayIndex];
  const tempMax = weatherData?.temperature_2m_max?.[todayIndex];
  const weatherLabel = weatherIcon.replace("_", " ");

  // légumes du mois
  const month = new Date().toLocaleString('fr-FR', { month: 'long' });
  const tips = plantingCalendar[month];
  const semis = tips.semis.join(', ');
  const plantation = tips.plantation.join(', ');
  const recolte = tips.recolte.join(', ');

  const prompt = `
Tu es un assistant pour jardinier. Aujourd'hui il fait ${weatherLabel}, avec des températures entre ${tempMin}°C et ${tempMax}°C.
Dans le jardin "${gardenName}", l'utilisateur a planté : ${plants}.
Voici les légumes du mois :
- À semer : ${semis}
- À planter : ${plantation}
- À récolter : ${recolte}

Donne un conseil personnalisé pour aujourd’hui. Sois bref, clair, et pratique.`;

  fetchMistralAI(prompt)
    .then(response => {
      aiAdvice.textContent = response;
    })
    .catch(() => {
      aiAdvice.textContent = "(Erreur IA)";
    });
}


const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatBox = document.getElementById("chatBox");

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = chatInput.value;
  if (!question.trim()) return;
  chatBox.innerHTML += `<div class="user-msg"><strong>Moi:</strong> ${question}</div>`;
  chatInput.value = "";

  try {
    const response = await fetchMistralAI(question);
    chatBox.innerHTML += `<div class="ai-msg"><strong>IA:</strong> ${response}</div>`;
  } catch {
    chatBox.innerHTML += `<div class="ai-msg error">(Erreur de réponse de l'IA)</div>`;
  }

  chatBox.scrollTop = chatBox.scrollHeight;
});

