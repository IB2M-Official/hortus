// script.js

// Initialisation
const locationInput = document.getElementById("location");
const dateSpan = document.getElementById("date");
const seasonSpan = document.getElementById("season");
const weatherSpan = document.getElementById("weather");
const calendarContainer = document.getElementById("calendarContainer");
const monthlyTips = document.getElementById("monthlyTips");
const aiAdvice = document.getElementById("aiAdvice");

// Constantes
const monthNames = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

// LocalStorage : charger config
const savedLocation = localStorage.getItem("location") || "Lyon";
locationInput.value = savedLocation;

// Mettre à jour météo et UI de base
document.addEventListener("DOMContentLoaded", () => {
  updateDateUI();
  generateCalendar();
  getWeather(savedLocation);
  loadTips();
  getMistralAdvice();
});

// Sauvegarde
const saveSettings = document.getElementById("saveSettings");
saveSettings.addEventListener("click", () => {
  const location = locationInput.value;
  localStorage.setItem("location", location);
  getWeather(location);
});

function updateDateUI() {
  const today = new Date();
  const day = today.getDate();
  const month = monthNames[today.getMonth()];
  const year = today.getFullYear();
  dateSpan.textContent = `${day} ${month} ${year}`;
  seasonSpan.textContent = getSeason(today.getMonth());
}

function getSeason(month) {
  if ([11, 0, 1].includes(month)) return "Hiver";
  if ([2, 3, 4].includes(month)) return "Printemps";
  if ([5, 6, 7].includes(month)) return "Été";
  return "Automne";
}

function generateCalendar() {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const card = document.createElement("div");
    card.className = "day-card";
    card.innerHTML = `
      <h4>${day} ${monthNames[today.getMonth()]}</h4>
      <img class="weather-icon" src="assets/icons/sun.png" alt="Météo">
      <span class="temperature">15°C</span>
    `;
    calendarContainer.appendChild(card);
  }
}

function getWeather(location) {
  // Simulation de météo - à remplacer par appel à une vraie API (OpenWeather, etc.)
  weatherSpan.textContent = `☀️ 15°C à ${location}`;
}

function loadTips() {
  monthlyTips.innerHTML = `
    <p><strong>Saison :</strong> ${getSeason(new Date().getMonth())}</p>
    <p><strong>À planter :</strong> carottes, laitues, radis</p>
    <p><strong>À récolter :</strong> épinards, pois</p>
  `;
}

function getMistralAdvice() {
  const gardenName = document.getElementById("gardenName").value || "mon jardin";
  const plants = document.getElementById("plants").value || "tomates, salades";

  fetchMistralAI(`Que dois-je faire aujourd'hui dans ${gardenName} avec ${plants}?`)
    .then(response => {
      aiAdvice.textContent = response;
    })
    .catch(() => {
      aiAdvice.textContent = "(Erreur lors de la récupération du conseil IA)";
    });
}
