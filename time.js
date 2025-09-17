const fireSound = document.getElementById("fireSound");
const soundBtn = document.getElementById("soundBtn");
let isPlaying = true; // ✅ start with sound on

// Try to play automatically (some browsers need user interaction)
window.addEventListener("load", () => {
  fireSound.play().catch(() => {
    // if autoplay is blocked, wait for first click
    isPlaying = false;
    soundBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  });
  soundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
});

soundBtn.addEventListener("click", () => {
  if (isPlaying) {
    fireSound.pause();
    soundBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  } else {
    fireSound.play();
    soundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  }
  isPlaying = !isPlaying;
});



 function updateClock() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;

      const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
      const dateString = now.toLocaleDateString(undefined, options);

      document.querySelector('.hours').textContent = formattedHours.toString().padStart(2, '0');
      document.querySelector('.minutes').textContent = minutes.toString().padStart(2, '0');
      document.querySelector('.seconds').textContent = seconds.toString().padStart(2, '0');
      document.querySelector('.ampm').textContent = ampm;
      document.querySelector('.date').textContent = dateString;

      requestAnimationFrame(updateClock);
    }

    function toggleTheme() {
      document.body.classList.toggle('dark-mode');
    }

    // 🌤 Weather Fetch
    async function fetchWeather() {
      const apiKey = "281f8de2a7ba0e67d0a1b4291c7e12f6"; // Replace with your OpenWeather API key
      const city = "Kuala Lumpur";   // Change to your location
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        const iconCode = data.weather[0].icon; // e.g. "10d"
        const iconClass = getWeatherIcon(iconCode);

        document.querySelector(".weather-location").textContent = data.name;
        document.querySelector(".weather-temp").textContent = Math.round(data.main.temp) + "°C";
        document.querySelector(".weather-desc").textContent = data.weather[0].description;
        document.querySelector(".weather-icon").innerHTML = `<i class="${iconClass}"></i>`;
      } catch (err) {
        document.querySelector(".weather-location").textContent = "Error";
      }
    }

    // 🎛 Make Movable
    function makeMovable(selector) {
      const widget = document.querySelector(selector);
      let isDragging = false;
      let offsetX, offsetY;

      widget.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - widget.offsetLeft;
        offsetY = e.clientY - widget.offsetTop;
        widget.style.cursor = "grabbing";
      });

      document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        widget.style.left = (e.clientX - offsetX) + "px";
        widget.style.top = (e.clientY - offsetY) + "px";
        widget.style.bottom = "auto"; 
        widget.style.right = "auto";  
      });

      document.addEventListener("mouseup", () => {
        isDragging = false;
        widget.style.cursor = "grab";
      });

      // Touch
      widget.addEventListener("touchstart", (e) => {
        isDragging = true;
        const touch = e.touches[0];
        offsetX = touch.clientX - widget.offsetLeft;
        offsetY = touch.clientY - widget.offsetTop;
      }, { passive: true });

      document.addEventListener("touchmove", (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        widget.style.left = (touch.clientX - offsetX) + "px";
        widget.style.top = (touch.clientY - offsetY) + "px";
        widget.style.bottom = "auto";
        widget.style.right = "auto";
      }, { passive: false });

      document.addEventListener("touchend", () => {
        isDragging = false;
      });
    }

    // 🌐 Font Awesome icon mapper
    function getWeatherIcon(weatherCode) {
      switch(weatherCode) {
        case "01d": return "fas fa-sun"; // clear day
        case "01n": return "fas fa-moon"; // clear night
        case "02d": return "fas fa-cloud-sun"; // few clouds day
        case "02n": return "fas fa-cloud-moon"; // few clouds night
        case "03d":
        case "03n": return "fas fa-cloud"; // scattered clouds
        case "04d":
        case "04n": return "fas fa-cloud-meatball"; // broken clouds
        case "09d":
        case "09n": return "fas fa-cloud-showers-heavy"; // shower rain
        case "10d": return "fas fa-cloud-sun-rain"; // rain day
        case "10n": return "fas fa-cloud-moon-rain"; // rain night
        case "11d":
        case "11n": return "fas fa-bolt"; // thunderstorm
        case "13d":
        case "13n": return "fas fa-snowflake"; // snow
        case "50d":
        case "50n": return "fas fa-smog"; // mist
        default: return "fas fa-question-circle"; // fallback
      }
    }

    // Initialize
    window.onload = function() {
      updateClock();
      fetchWeather();
      makeMovable(".clock-container");
      makeMovable(".weather-widget");
    };
  