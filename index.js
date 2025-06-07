function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function convertTimestampToDate(timestamp) {
  // Convert seconds to milliseconds
  const date = new Date(timestamp * 1000);

  // Format the date as a readable string
  return date.toLocaleString(); // e.g., "11/4/2025, 3:49:39 PM"
}

async function getWeatherMinMax(lat, lon) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=1262bc878bbdb5b164ca1e50b2e4e47c&units=metric`);
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    const dailyTemps = {};

    data.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0]; // "YYYY-MM-DD"
      const temp = item.main.temp;

      if (!dailyTemps[date]) {
        dailyTemps[date] = [];
      }
      dailyTemps[date].push(temp);
    });

    const days = Object.entries(dailyTemps).slice(0, 5); // First 5 days

    days.forEach(([date, temps], index) => {
      const min = Math.min(...temps).toFixed(1);
      const max = Math.max(...temps).toFixed(1);

      // 🟢 Assign to temp1, temp2, ..., temp5 using jQuery
      const tempId = `#temp${index + 1}`;
      const dayId = `#day${index + 1}`;
      const dateId = `#date${index + 1}`;

      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' }); // e.g., "Mon"
      const shortDate = new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); // e.g., "7 Jun"

      $(tempId).text(`${min}/${max}`);
      $(dayId).text(dayName);
      $(dateId).text(shortDate);
    });

  } catch (error) {
    console.error("Error fetching weather:", error);
  }
}



async function fetchTodayForecast(lat, lon) {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=1262bc878bbdb5b164ca1e50b2e4e47c&units=metric`);
    if (!res.ok) throw new Error("Network error");

    const data = await res.json();
    const forecastEntries = data.list.slice(0, 5); // First 5 entries (3-hour intervals)

    forecastEntries.forEach((item, index) => {
      const temp = item.main.temp.toFixed(1); // rounded to 1 decimal
      const time = new Date(item.dt_txt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      // Set text in elements like #row3temp1, #row3time1, ...
      const iconCode = item.weather[0].icon;
    //   console.log(iconCode)
      const iconUrl = `./${iconCode}.png`;

      $(`#row3temp${index + 1}`).text(`${temp}`);
      $(`#row3time${index + 1}`).text(time);
      $(`#row3icon${index + 1}`).attr('src', iconUrl).attr('alt', item.weather[0].description);
    });

  } catch (error) {
    console.error("Error fetching forecast:", error);
  }
}



//   fetchTodayForecast(18, 79.5833);




async function fetchData(){
    let cityName=document.getElementById("inputField").value;
    let requestedData =await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=1262bc878bbdb5b164ca1e50b2e4e47c&units=metric`);
    let formattedData =await requestedData.json();
    // console.log(formattedData)
    let responseCityName = formattedData.name
    let responseCityTemp = formattedData.main.temp.toFixed(1)
    let weatherIcon = formattedData.weather[0].icon
    let weatherIconUrl = `./${weatherIcon}.png`
    let responseCityDescription = capitalizeFirstLetter(formattedData.weather[0].description)
    let responseDateTime = convertTimestampToDate(formattedData.dt).split(",")
    let responseDate = responseDateTime[0]
    let responseTime = responseDateTime[1]
    let sunriseTime = convertTimestampToDate(formattedData.sys.sunrise).split(",")[1]
    let sunsetTime = convertTimestampToDate(formattedData.sys.sunset).split(",")[1]

    let responsePressure = formattedData.main.pressure
    let responseVisibility = formattedData.visibility*0.001
    let responseSpeed = formattedData.wind.speed
    let responseHumidity = formattedData.main.humidity

    let lat = formattedData.coord.lat
    let lon =formattedData.coord.lon
    let airPollutionData = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=1262bc878bbdb5b164ca1e50b2e4e47c&units=metric`)
    let airPollutionJsonData= await airPollutionData.json()
    // console.log(airPollutionJsonData)
    let pm25 = airPollutionJsonData.list[0].components.pm2_5
    let so2 = airPollutionJsonData.list[0].components.so2
    let no2 = airPollutionJsonData.list[0].components.no2
    let o3 = airPollutionJsonData.list[0].components.o3
    // console.log(pm25)

    getWeatherMinMax(lat, lon);
    fetchTodayForecast(lat, lon);


    $('#cityName').text(responseCityName)
    $('#cityTemp').text(responseCityTemp)
    $('#row3temp').text(responseCityTemp)
    $('#row3icon').attr('src', weatherIconUrl)
    $('#cityDescription').text(responseCityDescription)
    $('#date').text(responseDate)
    $('#time').text(responseTime.trim())
    $('#sunriseTime').text(sunriseTime.trim())
    $('#sunsetTime').text(sunsetTime.trim())
    // console.log(responseDate)
    // console.log(responseTime.trim())

    $('#pressure').text(responsePressure)
    $('#visibility').text(responseVisibility)
    $('#speed').text(responseSpeed)
    $('#humidity').text(responseHumidity)

    $('#pm25').text(pm25)
    $('#so2').text(so2)
    $('#no2').text(no2)
    $('#o3').text(o3)
}   

$('#inputField').keydown(function(e){
    if (e.key === 'Enter') {
        fetchData()
    }
})
