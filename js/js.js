var header2 = {
    'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
    'x-rapidapi-key': '6e42658982msh6989271eafb9b58p1dcedajsnb13930b22408',
  },
  id = '76ccebe7fc00800c304a0199ab746cbf',
  URL_getcurrentweather =
    'https://community-open-weather-map.p.rapidapi.com/weather?q=asaka%2Cuz&lat=0&lon=0&callback=test&id=2172797&lang=null&units=%22metric%22%20or%20%22imperial%22&mode=xml%2C%20html'
var fetch_weather = {
    method: 'GET',
    headers: header2,
  },
  day16list = [],
  hourdata = [],
  person = { name: 'Asaka' },
  days = {
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
    Sun: 'Sunday',
  },
  weatherdata = {}
function getcurrentweather() {
  fetch(
    'https://community-open-weather-map.p.rapidapi.com/forecast/daily?q=Asaka%2Cuz&cnt=7&units=metric%20or%20imperial',
    {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
        'x-rapidapi-key': '6e42658982msh6989271eafb9b58p1dcedajsnb13930b22408',
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      day16(data)
    })
    .catch((err) => {
      console.error(err)
    })
}

var currentdata = 0
function getweather(a) {
  // fetch current weather info

  fetch(
    'https://api.openweathermap.org/data/2.5/weather?q=Asaka,uz&appid=76ccebe7fc00800c304a0199ab746cbf'
  )
    .then((response) => response.json())
    .then((data) => {
      currentdata = {
        dt: get_data(data.dt),
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        main: data.weather[0].main,
        icon: data.weather[0].icon,
        name: data.name,
      }
      console.log(data)
      displayweather()
    })
    .catch((err) => {
      console.error(err)
    })
  fetch(
    'https://api.openweathermap.org/data/2.5/forecast?q=Asaka,uz&cnt=5&appid=' +
      id
  )
    .then((response) => response.json())
    .then((data) => {
      data = data.list
      var data4 = 0
      for (var i = 0; i < data.length; i++) {
        let date0 = new Date(data[i].dt * 1000).getHours()
        data4 = {
          day: date0,
          humidity: data[i].main.humidity,
          temp: data[i].main.temp,
          icon: data[i].weather[0].icon,
          main: data[i].weather[0].main,
        }
        hourdata.push(data4)
      }
      displayweather()
      console.log(data)
    })
    .catch((err) => {
      console.error(err)
    })
}
getcurrentweather()
function displayweather() {
  var tdw = document.getElementsByClassName('todayweather')[0],
    tdw2 = document.getElementsByClassName('weeksweather')[0],
    tdw3 = document.getElementsByClassName('aboutweather')[0]
  tdw.innerHTML =
    '<h1>' +
    currentdata.name +
    '</h1><p>' +
    currentdata.dt +
    '</p><div class="row">    <div class="info">      <span class="icon"><img src="./img/' +
    currentdata.icon +
    '.png" alt="eror"></span>      <span class="dagree-now" id="dagree-row">' +
    (currentdata.temp - 273.15).toFixed(0) +
    '<sup>o</sup></span>    </div>    <div class="info2">      <p class="des">' +
    currentdata.main +
    '</p>      <p class="temp2">' +
    (day16list[0].max - 273.15).toFixed(0) +
    '<sup>o</sup>/ ' +
    (day16list[0].min - 273.15).toFixed(0) +
    '<sup>o</sup></p>      <p class="feel">Feels like <span class="feellike">' +
    (currentdata.feels_like - 273.15).toFixed(0) +
    '<sup>o</sup></span></p>    </div>  </div><div class="hourweather row"></div>'
  for (
    var il = 0;
    il < 7 && document.getElementsByClassName('weekweather').length < 7;
    il++
  ) {
    var day = 0
    if (il == 0) {
      day = 'Today'
    } else {
      day = days[day16list[il]['day'].slice(0, 3)]
    }
    tdw2.innerHTML +=
      '<div class="weekweather row"><div class="week">' +
      day +
      '</div>  <div class="whumidity">    <img src="./img/humidity.png" alt="error" />' +
      day16list[il].humidity +
      '%</div>  <div class="wicon">    <img src="./img/' +
      day16list[il].icon +
      '.png" alt="error" />    <img src="./img/' +
      day16list[il].icon.slice(0, 2) +
      'n.png" alt="error" />  </div>  <div class="wgradus">' +
      (day16list[il].max - 273.15).toFixed(0) +
      '<sup>o</sup>/' +
      (day16list[il].min - 273.15).toFixed(0) +
      '<sup>o</sup></div></div>'
  }
  var tdh = document.getElementsByClassName('hourweather')[0]
  for (let i = 0; i < 5; i++) {
    tdh.innerHTML +=
      '<div class="hour"><p>' +
      hourdata[i].day +
      ' : 00</p><div class="icon"><img src="./img/' +
      hourdata[i].icon +
      '.png" alt="error" /></div><h2 class="gradus">' +
      (hourdata[i].temp - 273.15).toFixed(0) +
      '<sup>o</sup></h2><p class="humidity row"><img src="./img/humidity.png" alt="" />' +
      hourdata[i].humidity +
      '%</p></div>'
  }
  for (let i = 0; i < 7; i++) {
    tdw3.innerHTML +=
      '<div class="aw row"><div class="aw-img"><img src="./img/01d.png" alt="error" /></div><div class="aw-text row"><div class="text1">UV index</div><h3 class="text2">Low</h3></div></div>'
  }
}
function day16(data) {
  data = data.list
  var data2 = 0
  for (var i = 0; i < data.length; i++) {
    data2 = {
      day: get_data(data[i].dt),
      humidity: data[i].humidity,
      max: data[i].temp.max,
      min: data[i].temp.min,
      icon: data[i].weather[0].icon,
      main: data[i].weather[0].main,
    }
    day16list.push(data2)
  }
  getweather(URL_getcurrentweather)
  console.log(data)
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
// search section funtion; when type any key in input fild
document.getElementById('search').addEventListener('keydown', searchf(this))
function searchf(a) {
  console.log(ishlayapti)
  if (a.length > 3) {
    console.log('salom')
  } else {
    console.log(a)
  }
}
