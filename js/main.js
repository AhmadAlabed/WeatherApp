// ---------- Today ----------
const currentDay = document.getElementById('currentDay');
const currentMonth = document.getElementById('currentMonth');
const locationName = document.getElementById('locationName');
const currentDayTemp = document.getElementById('currentDayTemp');
const weatherState = document.getElementById('weatherState');
const currentDayIconWeather = document.getElementById('currentDayIconWeather');
const dailyChanceOfRain = document.getElementById('dailyChanceOfRain');
const windKph = document.getElementById('windKph');
const windDir = document.getElementById('windDir');
// ---------- Today ----------
// ---------- Tomorrow ----------
const tomorrowDay = document.getElementById('tomorrowDay');
const tomorrowIconWeather = document.getElementById('tomorrowIconWeather');
const tomorrowMaxTemp = document.getElementById('tomorrowMaxTemp');
const tomorrowMixTemp = document.getElementById('tomorrowMixTemp');
const tomorrowWeatherState = document.getElementById('tomorrowWeatherState');
// ---------- Tomorrow ----------
// ---------- After Tomorrow ----------
const afterTomorrowDay = document.getElementById('afterTomorrowDay');
const afterTomorrowIconWeather = document.getElementById('afterTomorrowIconWeather');
const afterTomorrowMaxTemp = document.getElementById('afterTomorrowMaxTemp');
const afterTomorrowMixTemp = document.getElementById('afterTomorrowMixTemp');
const afterTomorrowWeatherState = document.getElementById('afterTomorrowWeatherState');
// ---------- After Tomorrow ----------
//--------------------------------------
const searchlocation = document.getElementById('searchlocation');
const currentLocationText = document.getElementById('currentLocationText');
const autocompleteCitiesUl = document.getElementById('autocompleteCities');
const buttonSearchlocation = document.getElementById('buttonSearchlocation');
const locationHistory = document.getElementById('locationHistory');
const close = document.getElementsByClassName('close');
const tempC = document.getElementById('C');
const tempF = document.getElementById('F');
//--------------------------------------
// ---------- Global Variables ----------
let tempTemp = localStorage.getItem('temp');
if(tempTemp==null)
{
    localStorage.setItem('temp','℃');
}
let tempType = localStorage.getItem('temp');
if(tempType=='℃')
{
    //
}
else
{
    tempF.classList.replace('btn-outline-dark','btn-dark');
    tempC.classList.replace('btn-dark','btn-outline-dark');
}
let currentLocationCity='';
let globalSelectedCity='';
// ---------- Global Variables ----------

// ---------- Global Calling Area ----------
currentLocation(getWeather);
// ---------- Global Calling Area ----------

// ---------- Main Functions ----------
// ---------- Main Function 1 ----------
async function getWeather(searchText,temp)
{
    try
    {
        let weatherResponse = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=2aab25e78a8343a498672009221701&q=${searchText}&days=3`);
        if(weatherResponse.ok && weatherResponse.status!=400)
        {
            let weatherObject = await weatherResponse.json();
            // Today
            let {localtime ,name,country} = weatherObject.location;
            let {temp_c , temp_f ,wind_kph,wind_dir} = weatherObject.current;
            let {text , icon} = weatherObject.current.condition;
            let {daily_chance_of_rain} = weatherObject.forecast.forecastday[0].day;
            if(temp=='℃')
            {
                displayTodayWeather(localtime ,name,temp_c,text,icon,daily_chance_of_rain,wind_kph,wind_dir);
            }
            else if(temp=='℉')
            {
                displayTodayWeather(localtime ,name,temp_f,text,icon,daily_chance_of_rain,wind_kph,wind_dir);
            }
            // tomorrow
            let {date} = weatherObject.forecast.forecastday[1];
            let {maxtemp_c,maxtemp_f,mintemp_c,mintemp_f} = weatherObject.forecast.forecastday[1].day;
            let {text:textTomorrow , icon:iconTomorrow} = weatherObject.forecast.forecastday[1].day.condition;
            if(temp=='℃')
            {
                displayTomorrowWeather(date,iconTomorrow,maxtemp_c,mintemp_c,textTomorrow);
            }
            else if(temp=='℉')
            {
                displayTomorrowWeather(date,iconTomorrow,maxtemp_f,mintemp_f,textTomorrow);
            }
            // After Tomorrow
            let {date:afterTomorrowDate} = weatherObject.forecast.forecastday[2];
            let {maxtemp_c:maxtemp_c2,maxtemp_f:maxtemp_f2,mintemp_c:mintemp_c2,mintemp_f:mintemp_f2} = weatherObject.forecast.forecastday[2].day;
            let {text:textAfterTomorrow , icon:iconAfterTomorrow} = weatherObject.forecast.forecastday[2].day.condition;
            if(temp=='℃')
            {
                displayAfterTomorrowWeather(afterTomorrowDate,iconAfterTomorrow,maxtemp_c2,mintemp_c2,textAfterTomorrow);
            }
            else if(temp=='℉')
            {
                displayAfterTomorrowWeather(afterTomorrowDate,iconAfterTomorrow,maxtemp_f2,mintemp_f2,textAfterTomorrow);
            }
            //globalSlectedCity
            globalSelectedCity=`${name}, ${country}`;
            saveCityInHistory(globalSelectedCity);
            let cityInHistory = JSON.parse(localStorage.getItem('city'));
            if(cityInHistory!=null)
            {
                showCityInHistory();
            }
         } 
    }
    catch
    {
        //Error
    }
}

// ---------- Main Function 2 ----------
async function currentLocation(callback)
{
    try
    {
        let locationResponse = await fetch(`https://api.weatherapi.com/v1/ip.json?key=2aab25e78a8343a498672009221701&q=auto:ip`);
        if(locationResponse.ok && locationResponse.status!=400)
        {
            let locationObject = await locationResponse.json();
            currentLocationText.textContent=`Use your current Location:  ${locationObject.city}, ${locationObject.country_name}`;
            currentLocationCity=`${locationObject.city}, ${locationObject.country_name}`;
            globalSelectedCity=locationObject.city;
            callback(locationObject.city,tempType);
        }
        
    }
    catch
    {
        //Error
    }
}

// ---------- Show Today Function ----------
function displayTodayWeather(localtimeP,locationNameP,currentDayTempP ,weatherStateP ,currentDayIconWeatherP ,dailyChanceOfRainP ,windKphP ,windDirP)
{
    let localtime = new Date(localtimeP);
    currentDay.textContent = localtime.toLocaleDateString('en-EG', { weekday: 'long' });
    currentMonth.textContent =localtime.toLocaleDateString('en-EG', { day: 'numeric', month: 'long'});
    locationName.textContent = locationNameP;
    currentDayTemp.textContent = currentDayTempP + tempType;
    weatherState.textContent = weatherStateP;
    currentDayIconWeather.src ="https:"+currentDayIconWeatherP;
    dailyChanceOfRain.textContent = dailyChanceOfRainP + "%";
    windKph.textContent = windKphP + " km/h";
    windDir.textContent = windDirP;
}
// ---------- Show Tomorrow Function ----------
function displayTomorrowWeather(tomorrowDayP,tomorrowIconWeatheP, tomorrowMaxTempP ,tomorrowMixTempP , tomorrowWeatherStateP)
{
     let tomorrowDate = new Date(tomorrowDayP);
     tomorrowDay.textContent = tomorrowDate.toLocaleDateString('en-EG', { weekday: 'long' });
     tomorrowIconWeather.src = "https:"+tomorrowIconWeatheP;
     tomorrowMaxTemp.textContent = tomorrowMaxTempP;
     tomorrowMixTemp.textContent = tomorrowMixTempP;
     tomorrowWeatherState.textContent = tomorrowWeatherStateP;
}
// ---------- Show After Tomorrow Function ----------
function displayAfterTomorrowWeather(afterTomorrowDayP,afterTomorrowIconWeatheP, afterTomorrowMaxTempP ,afterTomorrowMixTempP , afterTomorrowWeatherStateP)
{
     let afterTomorrowDate = new Date(afterTomorrowDayP);
     afterTomorrowDay.textContent = afterTomorrowDate.toLocaleDateString('en-EG', { weekday: 'long' });
     afterTomorrowIconWeather.src = "https:"+afterTomorrowIconWeatheP;
     afterTomorrowMaxTemp.textContent = afterTomorrowMaxTempP;
     afterTomorrowMixTemp.textContent = afterTomorrowMixTempP;
     afterTomorrowWeatherState.textContent = afterTomorrowWeatherStateP;
}


// ---------- Autocomplete Function ----------
async function autocompleteCities(searchText)
{
    try
    {
        let autocompleteResponse = await fetch(`https://api.weatherapi.com/v1/search.json?key=2aab25e78a8343a498672009221701&q=${searchText}`);
        if(autocompleteResponse.ok && autocompleteResponse.status!=400)
        {
            let autocompleteObject = await autocompleteResponse.json();
            let arrayOfCity = autocompleteObject.map(item => `${item['name']}, ${item['country']}`);
            displayAutocompleteCities(arrayOfCity);
        }
    }
    catch
    {
        //Error
    }
}
// ---------- Display Autocomplete Function ----------
function displayAutocompleteCities(arrCities)
{
    autocompleteCitiesUl.style.display='block';
    let ulContent='';
    for (const city of arrCities) {
    ulContent+=`
    <li class="list-group-item" onclick='autocompleteCitiesEvents(this.textContent)' >${city}</li>
    `
    }
    autocompleteCitiesUl.innerHTML=ulContent;
}
function autocompleteCitiesEvents(selectedCity)
{
    searchlocation.value=selectedCity;
    autocompleteCitiesUl.style.display='none';
    searchlocation.focus();
}
function selectCitiesEvents(selectedCity)
{
    searchlocation.value=selectedCity;
    autocompleteCities(selectedCity);
    searchlocation.focus();
}
function saveCityInHistory(cityName)
{
    let cityInHistory = JSON.parse(localStorage.getItem('city'));
    if(cityInHistory == null)
    {
        if(cityName!=currentLocationCity)
        {
            cityInHistory=[];
            cityInHistory.push(cityName);
            localStorage.setItem('city',JSON.stringify(cityInHistory));
        }
    }
    else
    {
        if(cityInHistory.length==1)
        {
            if(cityInHistory[0]!=cityName && cityName!=currentLocationCity)
            {
                cityInHistory.push(cityName);
                localStorage.setItem('city',JSON.stringify(cityInHistory));
            }
        }
        else
        {
            if(cityInHistory[0]!=cityName && cityInHistory[1]!=cityName && cityName!=currentLocationCity)
            {
                cityInHistory.shift();
                cityInHistory.push(cityName);
                localStorage.setItem('city',JSON.stringify(cityInHistory));
            }
        }
        
    }
}
function showCityInHistory()
{
    let cityInHistory = JSON.parse(localStorage.getItem('city'));
    let innerHTMLString ='';
    for (let i=0 ; i<cityInHistory.length; i++)
    {
        innerHTMLString+=`
            <div class="cityHistory  text-other-color d-flex justify-content-between align-items-center">
                <div>
                <i class="fas fa-chevron-right me-2"></i><span onclick='selectCitiesEvents(this.textContent)' >${cityInHistory[i]}</span>
                </div>
                <i class="fas fa-times close"  name='${cityInHistory[i]}' onclick='deleteCityFromHistory(this)'></i>
            </div>
        `
    }
    locationHistory.innerHTML=innerHTMLString;
    
}

function deleteCityFromHistory(element)
{
    let cityInHistory = JSON.parse(localStorage.getItem('city'));
    if(cityInHistory!=null)
    {
        let index = cityInHistory.indexOf(element.getAttribute('name'));
        cityInHistory.splice(index,1);
        if(cityInHistory.length == 0)
        {
            localStorage.setItem('city',JSON.stringify(cityInHistory));
        }
        else
        {
            localStorage.setItem('city',JSON.stringify(cityInHistory));
        }
        showCityInHistory();
    }
}

 







// ---------------- Events ----------------
searchlocation.addEventListener('keyup',function(){
    autocompleteCities(this.value);
});
// ----------------  ----------------
currentLocationText.addEventListener('click',function(){
    getWeather(currentLocationCity,tempType);
    searchlocation.value='';

});
// ----------------  ----------------
searchlocation.addEventListener('input', function(){
    if(searchlocation.value =='')
    {
        displayAutocompleteCities([]);
    }
});
// ----------------  ----------------
document.addEventListener('click', function(e){
    if(e.target!=searchlocation)
    {
        autocompleteCitiesUl.style.display='none';
    }
});
// ----------------  ----------------
searchlocation.addEventListener('click', function(){
    autocompleteCitiesUl.style.display='block'
});
// ----------------  ----------------
searchlocation.addEventListener('focus', function(){
    autocompleteCitiesUl.style.display='block'
});
// ----------------  ----------------
searchlocation.addEventListener('keydown', function(e){
    if(e.code=='Enter')
    {
        getWeather(searchlocation.value,tempType);
    }
});
// ----------------  ----------------
buttonSearchlocation.addEventListener('click' , function(){
   getWeather(searchlocation.value,tempType);
});
// ---------------- Events ----------------
tempC.addEventListener('click',function(e){
    if(tempType!='℃')
    {
        tempType='℃';
        localStorage.setItem('temp','℃');
        tempC.classList.replace('btn-outline-dark','btn-dark');
        tempF.classList.replace('btn-dark','btn-outline-dark');
        getWeather(globalSelectedCity,tempType);
    }
});
tempF.addEventListener('click',function(e){
    if(tempType!='℉')
    {
        tempType='℉';
        localStorage.setItem('temp','℉');
        tempF.classList.replace('btn-outline-dark','btn-dark');
        tempC.classList.replace('btn-dark','btn-outline-dark');
        getWeather(globalSelectedCity,tempType);
    }
    
});
// ---------------- Events ----------------