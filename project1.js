const form = document.getElementById("search-form");
const cityInput = document.getElementById("city");
const result = document.getElementById("result");
const place = document.getElementById("place");
const summary = document.getElementById("summary");
const hourlyList = document.getElementById("hourly");
const errorEl = document.getElementById("error");
const unitToggle = document.getElementById("unit-toggle");

let isCelsius = true;
let currentData = null; // Store weather data for unit conversion

// Weather code descriptions
const weatherDescriptions = {
  0: "Clear sky ☀️",
  1: "Mainly clear 🌤️",
  2: "Partly cloudy ⛅",
  3: "Overcast ☁️",
  45: "Fog 🌫️",
  48: "Depositing rime fog 🌫️",
  51: "Light drizzle 🌦️",
  53: "Moderate drizzle 🌦️",
  55: "Dense drizzle 🌧️",
  61: "Slight rain 🌦️",
  63: "Moderate rain 🌧️",
  65: "Heavy rain 🌧️",
  71: "Slight snow ❄️",
  73: "Moderate snow ❄️",
  75: "Heavy snow ❄️",
  80: "Rain showers 🌦️",
  81: "Moderate showers 🌧️",
  82: "Violent showers ⛈️",
  95: "Thunderstorm ⛈️",
  96: "Thunderstorm with hail ⛈️",
  99: "Severe thunderstorm ⛈️"
};

// Format hour to "1 AM" style
function formatHour12(dateStr) {
  return new Date(dateStr).toLocaleTimeString([], { hour: "numeric", hour12: true });
}

// Celsius to Fahrenheit
function cToF(c) {
  return Math.round((c * 9) / 5 + 32);
}

// Fahrenheit to Celsius (not needed here but useful)
function fToC(f) {
  return Math.round(((f - 32) * 5) / 9);
}

// Render weather data
function renderWeather() {
  if (!currentData) return;

  const { name, country, current, hourly } = currentData;

  place.textContent = `${name}, ${country}`;

  const t = isCelsius ? Math.round(current.tempC) : cToF(current.tempC);
  const feels = isCelsius ? Math.round(current.feelsC) : cToF(current.feelsC);
  const unit = isCelsius ? "°C" : "°F";

  summary.innerHTML = `
    <strong>Now:</strong> ${t}${unit} (feels like ${feels}${unit})<br>
    ${weatherDescriptions[current.code] || `Code ${current.code}`}
  `;

  hourlyList.innerHTML = "";
  hourly.time.forEach((h, i) => {
    const temp = isCelsius ? Math.round(hourly.tempC[i]) : cToF(hourly.tempC[i]);
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${formatHour12(h)}</strong>
      <span>${temp}${unit}</span><br>
      ${weatherDescriptions[hourly.code[i]] || `Code ${hourly.code[i]}`}
    `;
    hourlyList.appendChild(li);
  });

  result.hidden = false;
}

// Fetch weather data
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.hidden = true;
  result.hidden = true;
  hourlyList.innerHTML = "";

  try {
    const q = encodeURIComponent(cityInput.value.trim());
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${q}&count=1`);
    const geo = await geoRes.json();

    if (!geo.results || geo.results.length === 0) {
      throw new Error("City not found.");
    }

    const { name, country, latitude, longitude, timezone } = geo.results[0];

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code&hourly=temperature_2m,weather_code&timezone=${timezone}`
    );
    const data = await weatherRes.json();

    // Store data for toggling
    currentData = {
      name,
      country,
      current: {
        tempC: data.current.temperature_2m,
        feelsC: data.current.apparent_temperature,
        code: data.current.weather_code
      },
      hourly: {
        time: data.hourly.time.slice(0, 12),
        tempC: data.hourly.temperature_2m.slice(0, 12),
        code: data.hourly.weather_code.slice(0, 12)
      }
    };

    renderWeather();
  } catch (err) {
    errorEl.textContent = err.message || "Something went wrong.";
    errorEl.hidden = false;
  }
});

// Toggle unit
unitToggle.addEventListener("click", () => {
  isCelsius = !isCelsius;
  unitToggle.textContent = isCelsius ? "Switch to °F" : "Switch to °C";
  renderWeather();
});
