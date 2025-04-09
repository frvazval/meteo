async function obtenerClima() {
    // Obtener la clave API desde el archivo apikey.txt
    const apiKey = await fetch('apikey.txt').then(response => response.text()).then(text => text.trim());
    const ciudad = document.getElementById("ciudad").value;
    const idioma = document.getElementById("idioma").value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=${idioma}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Ciudad no encontrada");
        
        const data = await response.json();
        
        // Extraer datos del JSON
        const nombreCiudad = data.name;
        const temperatura = `${data.main.temp}°C`;
        const presion = `Presión: ${data.main.pressure} hPa`;
        const humedad = `Humedad: ${data.main.humidity}%`;
        const descripcion = data.weather[0].description;
        const icono = `img/${data.weather[0].icon}.svg`;

        // Actualizar el DOM con los datos obtenidos
        document.getElementById("nombreCiudad").textContent = nombreCiudad;
        document.getElementById("temperatura").textContent = temperatura;
        document.getElementById("presion").textContent = presion;
        document.getElementById("humedad").textContent = humedad;
        document.getElementById("descripcion").textContent = descripcion;

        // Mostrar el icono del clima
        document.getElementById("icono").innerHTML = `<img id="icono-clima" src="${icono}" alt="${descripcion}">`;

        // Fetch weather forecast
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&lang=${idioma}&units=metric&appid=${apiKey}`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);
    
    } catch (error) {
        alert("Error: " + error.message);
    }
}

function displayForecast(data) {
    const forecastContainer = document.getElementById("forecast-container");
    forecastContainer.innerHTML = ""; // Clear previous forecast

    const forecastList = data.list.filter((item, index) => index % 8 === 0); // Get daily forecasts (every 8th item)
    // Solo quiero las 4 últimas previsiones, porque la primera ya aparece en la parte superior
    const lastFourForecasts = forecastList.slice(-4); // Get the last 4 forecasts

    lastFourForecasts.forEach(forecast => {
        const forecastItem = document.createElement("div");
        forecastItem.className = "forecast-item";

        const date = new Date(forecast.dt * 1000).toLocaleDateString();       
        const icon = `img/${forecast.weather[0].icon}.svg`;
        const temp = `${forecast.main.temp}°C`;
        const description = forecast.weather[0].description;

        forecastItem.innerHTML = `
            <p>${date}</p>
            <img src="${icon}" alt="${description} class="icono-prevision">
            <p>${temp}</p>
            <p>${description}</p>
        `;

        forecastContainer.appendChild(forecastItem);
    });
}

// Función que muestra la fecha y hora actual en pantalla
function muestraFechayHora() {
    const fechaHora = document.getElementById('fechaHora');
    const now = new Date();
    fechaHora.textContent = now.toLocaleString();
    setTimeout(muestraFechayHora, 1000);
}

// Evento para buscar al presionar "Enter"
document.getElementById("ciudad").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        obtenerClima();
    }
});
