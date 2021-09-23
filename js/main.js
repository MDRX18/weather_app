var person = {
    asosiy: { name: '', lat: '', lon: '' },
    qoshimcha: [''],
  },
  lat = 40.6415,
  lon = 72.2387,
  days = {
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
    Sun: 'Sunday',
  },
  aqi = 0,
  loader = document.getElementsByClassName('loader')[0],
  search_location = []
function getlocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(savelocation, locationerror)
  } else {
    alert('Geolocation is not supported by this browser.')
  }
}
function savelocation(position) {
  console.log(person)
  person.asosiy.lat = position.coords.latitude
  person.asosiy.lon = position.coords.longitude

  fetch(
    'https://api.openweathermap.org/data/2.5/weather?lat=' +
      person.asosiy.lat +
      '&lon=' +
      person.asosiy.lon +
      '&appid=76ccebe7fc00800c304a0199ab746cbf'
  )
    .then((response) => response.json())
    .then((data) => {
      person.qoshimcha[0] = {
        name: data.name,
        country: data.sys.country,
        lon: position.coords.longitude,
        lat: position.coords.latitude,
      }
      person.asosiy.status = 'loc' //know this is location which is
      person.asosiy.country = data.sys.country
      person.asosiy.name = data.name
      console.log(person)
    })
    .catch((err) => {
      console.error(err)
    })

  getweather()
}
function locationerror(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert(
        'Permision denaid or turn off location.\nPlease turn on the location and try again!!!'
      )
      opensearch()
      break
    case error.POSITION_UNAVAILABLE:
      alert('position unavailable')
      break
    case error.TIMEOUT:
      alert('The request to get user location timed out.')
      break
    case error.UNKNOWN_ERROR:
      alert('An unknown error occurred.')
      break
  }
}
function getweather(a) {
  // fetch current weather info
  fetch(
    'http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=' +
      person.asosiy.lat +
      '&lon=' +
      person.asosiy.lon +
      '&appid=76ccebe7fc00800c304a0199ab746cbf'
  )
    .then((response) => response.json())
    .then((data) => {
      aqi = data.list[0].main.aqi
      console.log(data)
    })
    .catch((err) => {
      console.error(err)
    })
  fetch(
    'https://api.openweathermap.org/data/2.5/onecall?lat=' +
      person.asosiy.lat +
      '&lon=' +
      person.asosiy.lon +
      '&appid=76ccebe7fc00800c304a0199ab746cbf'
  )
    .then((response) => response.json())
    .then((data) => {
      weatherdata = {
        current: {
          dt: get_data(data.current.dt),
          temp: todeg(data.current.temp),
          feels_like: todeg(data.current.feels_like),
          main: data.current.weather[0].main,
          icon: data.current.weather[0].icon,
          name: person.asosiy.name,
          uvi: data.current.uvi,
          sunrise: get_data(data.current.sunrise),
          sunset: get_data(data.current.sunset),
          wind: data.current.wind_speed,
          humidity: data.current.humidity,
        },
        hourly: {},
        daily: {},
      }
      for (var i = 0; i < 5; i++) {
        weatherdata.hourly[i] = {
          dt: get_data(data.hourly[i].dt),
          temp: todeg(data.hourly[i].temp),
          icon: data.hourly[i].weather[0].icon,
          humidity: data.hourly[i].humidity,
        }
      }
      for (let i = 0; i < 8; i++) {
        weatherdata.daily[i] = {
          dt: get_data(data.daily[i].dt),
          temp_max: todeg(data.daily[i].temp.max),
          temp_min: todeg(data.daily[i].temp.min),
          icon: data.daily[i].weather[0].icon,
          humidity: data.daily[i].humidity,
        }
      }
      displayweather()
    })
    .catch((err) => {
      console.error(err)
    })
}
function displayweather() {
  var tdw = document.getElementsByClassName('todayweather')[0],
    tdw2 = document.getElementsByClassName('weeksweather')[0],
    tdw3 = document.getElementsByClassName('text2')

  tdw.innerHTML =
    '<h1>' +
    weatherdata.current.name +
    '</h1><p>' +
    weatherdata.current.dt +
    '</p><div class="row">    <div class="info">      <span class="icon"><img src="./img/' +
    weatherdata.current.icon +
    '.png" alt="eror"></span>      <span class="dagree-now" id="dagree-row">' +
    weatherdata.current.temp +
    '<sup>o</sup></span>    </div>    <div class="info2">      <p class="des">' +
    weatherdata.current.main +
    '</p>      <p class="temp2">' +
    weatherdata.daily[0].temp_max +
    '<sup>o</sup>/ ' +
    weatherdata.daily[0].temp_min +
    '<sup>o</sup></p>      <p class="feel">Feels like <span class="feellike">' +
    weatherdata.current.feels_like +
    '<sup>o</sup></span></p>    </div>  </div><div class="hourweather row"></div>'
  tdw2.innerHTML = ''
  for (var il = 0; il < 7; il++) {
    var day = 0
    if (il == 0) {
      day = 'Today'
    } else {
      day = days[weatherdata.daily[il].dt.slice(0, 3)]
    }
    tdw2.innerHTML +=
      '<div class="weekweather row"><div class="week">' +
      day +
      '</div>  <div class="whumidity">    <img src="./img/humidity.png" alt="error" />' +
      weatherdata.daily[il].humidity +
      '%</div>  <div class="wicon">    <img src="./img/' +
      weatherdata.daily[il].icon +
      '.png" alt="error" />    <img src="./img/' +
      weatherdata.daily[il].icon.slice(0, 2) +
      'n.png" alt="error" />  </div>  <div class="wgradus">' +
      weatherdata.daily[il].temp_max +
      '<sup>o</sup>/' +
      weatherdata.daily[il].temp_min +
      '<sup>o</sup></div></div>'
  }
  var tdh = document.getElementsByClassName('hourweather')[0]
  for (let i = 0; i < 5; i++) {
    tdh.innerHTML +=
      '<div class="hour"><p>' +
      weatherdata.hourly[i].dt.slice(-6, -3) +
      ' : 00</p><div class="icon"><img src="./img/' +
      weatherdata.hourly[i].icon +
      '.png" alt="error" /></div><h2 class="gradus">' +
      weatherdata.hourly[i].temp +
      '<sup>o</sup></h2><p class="humidity row"><img src="./img/humidity.png" alt="" />' +
      weatherdata.hourly[i].humidity +
      '%</p></div>'
  }
  for (let iw = 0; iw < 7; iw++) {
    switch (iw) {
      case 0:
        if (weatherdata.current.uvi < 3) {
          tdw3[iw].innerHTML = 'Low'
        } else if (weatherdata.current.uvi < 6) {
          tdw3[iw].innerHTML = 'Moderate'
        } else if (weatherdata.current.uvi < 8) {
          tdw3[iw].innerHTML = 'High'
        } else if (weatherdata.current.uvi < 11) {
          tdw3[iw].innerHTML = 'Very High'
        } else {
          tdw3[iw].innerHTML = 'Extreme'
        }
        break
      case 1:
        tdw3[iw].innerHTML = weatherdata.current.sunrise.slice(-6)
        break

      case 2:
        tdw3[iw].innerHTML = weatherdata.current.sunset.slice(-6)
        break

      case 3:
        tdw3[iw].innerHTML =
          (weatherdata.current.wind * 3.6).toFixed(0) + ' km/h'
        break

      case 4:
        console.log(aqi)
        if (aqi === 1) {
          tdw3[iw].innerHTML = 'Good'
        } else if (aqi === 2) {
          tdw3[iw].innerHTML = 'Fair'
        } else if (aqi === 3) {
          tdw3[iw].innerHTML = 'Moderate'
        } else if (aqi === 4) {
          tdw3[iw].innerHTML = 'Poor'
        } else {
          tdw3[iw].innerHTML = 'Very poor'
        }
        break

      case 5:
        tdw3[iw].innerHTML = weatherdata.current.humidity + '%'
        break
    }
  }
  setTimeout(function () {
    loader.style.top = '-50px'
  }, 200)
  localStorage.setItem('person', JSON.stringify(person))
}

function get_data(a) {
  let unix_timestamp = a
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  let date0 = new Date(unix_timestamp * 1000)
  date0 = String(date0)
  date0 = date0.slice(0, date0.search('GMT') - 4)
  return date0
}
function todeg(a) {
  a = (a - 273.15).toFixed(0)
  return a
}
// getlocation()
// search section funtion; when type any key in input fild
document.getElementById('search').addEventListener('keyup', searchf)
function searchf() {
  var search_element = document.getElementById('search-result'),
    searchf1 = document.getElementById('search')
  if (searchf1.value.length > 3) {
    fetch(
      'https://community-open-weather-map.p.rapidapi.com/find?q=' +
        this.value +
        '&cnt=10&mode=null&type=link%2C%20accurate&lat=0&units=imperial%2C%20metric',
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key':
            '6e42658982msh6989271eafb9b58p1dcedajsnb13930b22408',
          'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        data = data.list
        if (data.length === 0) {
          search_element.innerHTML = 'Not Found'
        } else {
          search_location = []
          for (let i = 0; i < data.length; i++) {
            search_location.push({
              name: data[i].name,
              country: data[i].sys.country,
              lon: data[i].coord.lon,
              lat: data[i].coord.lat,
            })
            if (i === 0) {
              search_element.innerHTML = ''
            }
            search_element.innerHTML +=
              '<div class="searc" onclick="save_loacation(' +
              i +
              ')">' +
              data[i].name +
              ', ' +
              search_location[i].country +
              '</div>'
          }
        }
      })
      .catch((err) => {
        console.error(err)
      })
  } else {
    search_element.innerHTML = ''
  }
}
function save_loacation(a) {
  person.qoshimcha.push({
    name: search_location[a].name,
    country: search_location[a].country,
    lon: search_location[a].lon,
    lat: search_location[a].lat,
  })
  person.asosiy = {
    name: search_location[a].name,
    country: search_location[a].country,
    lon: search_location[a].lon,
    lat: search_location[a].lat,
    status: 'unloc',
  }
  loader.style.top = '20%'
  getweather()
  console.log(person)
  closesearch()
}
// open and close search section
var search1 = document.getElementsByClassName('search-a')[0],
  menyu = document.getElementsByClassName('menyu')[0]
function opensearch() {
  search1.style.opacity = '1'
  search1.style.zIndex = '99'
}
function closesearch() {
  search1.style.opacity = '0'
  search1.style.zIndex = '-1'

  document.getElementById('search').value = ''
  searchf()
}
function openloc() {
  var menyus = document.getElementsByClassName('menyus')[0]
  menyu.style.opacity = '1'
  menyu.style.zIndex = '99'
  console.log(person.qoshimcha.length)
  menyus.innerHTML = ''
  if (person.qoshimcha[0].name) {
    menyus.innerHTML +=
      '<div class="menyu-item" onclick="open_old(' +
      0 +
      ')"><i class="fas fa-map-marker-alt"></i>\t' +
      person.qoshimcha[0].name +
      ', ' +
      person.qoshimcha[0].country +
      '</div>'
  }
  for (let i = 1; i < person.qoshimcha.length; i++) {
    menyus.innerHTML +=
      '<div class="menyu-item" onclick="open_old(' +
      i +
      ')">' +
      person.qoshimcha[i].name +
      ', ' +
      person.qoshimcha[i].country +
      '</div>'
  }
}
function open_old(a) {
  person.asosiy = {
    name: person.qoshimcha[a].name,
    country: person.qoshimcha[a].country,
    lon: person.qoshimcha[a].lon,
    lat: person.qoshimcha[a].lat,
    status: 'unloc',
  }
  if (a === 0) {
    person.asosiy.status = 'loc'
  }
  getweather()
  closeloc()
  loader.style.top = '20%'
}
function closeloc() {
  menyu.style.opacity = '0'
  menyu.style.zIndex = '-1'
}
// get location
function get_location(a) {
  if (confirm(a)) {
    getlocation()
    closesearch()
  } else {
    opensearch()
  }
}
// use local storage and save personal information on browser storage
function str_local() {
  if (typeof Storage !== 'undefined') {
    if (localStorage.person) {
      person = JSON.parse(localStorage.getItem('person'))
      if (person.asosiy.status === 'loc') {
        getlocation()
      } else {
        getweather()
      }
      console.log(person)
      closesearch()
    } else {
      get_location(
        'Wellcome Weather app\nUse current location\nTo get local weather, your current location will be send to the weather services provider.\nIn order to provide you with continuing weather information, Weather will have access to your location next time.'
      )
    }
  } else {
    alert('Sorry, your browser does not support web storage...')
    getlocation()
  }
}
str_local()
