/*
 - create global variables that query select all the neccessary elements from the page
 - initialise the date with momentjs api and pass to a variable in formatted form
 - hide all the search links and the weather cards from the page
 - create a function "searchEvent" that when invoked will listen to the search button on the page
    - this function will take in the form input, check if the string is valid by testing it against the response from the openweather api and if response.ok is false then handle the error as a message that appears under the form input element on the page. If response.ok is true then save the search to local storage. 
    - To save the search string to local storage create a array variable that holds the object with the city name, this variable will be a ternary operator that if evaluates to true returns the parsed object from local storage or if false returns the empty array. 
    - before storing to local storage we need to check if that city already exists and only push it to the array if it does not exist. 
    - when the function is invoked and city is validated by checking it does not exist, it should be pushed to the array and saved to local storage. 
- after the search has been stored to local storage the "generateBtn" function should be invoked.
    - this function should only dynamically create the button for the page and append it to the "searchLinksEl" element in question. 
- when the page is first loaded a "displayAllBtns" is invoked that takes in a function that returns the parsed array of all the current searches stored within local storage and will loop through this array of objects and render the buttons on the page. 
- when a user inputs a valid city search: a todays weather card will be displayed including a five day weather forecast.
    - this is achieved by calling the openweatherapi and on recieving a valid response: the first element of the response array containing all the properties needed, will be the todays forecast whereas looping through the rest of the array and only retrieving the correct element for each day of the five day weather forecast is then displayed in to weather cards. 
    - before doing so we need to get the latitude and longitude to pass in to the openweatherapi to return a valid json object with the weather forecast data
*/

console.log("index.js file loaded");

// Global variables

const apiKey = "d0af7ceac9a3501bc47a8577610395a2";

const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";

const apiForecast = "https://api.openweathermap.org/data/2.5/forecast?";

// creating array to hold the users city searches

const citySearches = window.localStorage.getItem("searches")
  ? JSON.parse(window.localStorage.getItem("searches"))
  : [];

// Query selecting page elements

// const cardContainerEl = document.getElementsByClassName("card__container");

const cardEl = document.querySelectorAll(".card");

const searchLinksEl = document.querySelector(".search__links");

const searchBtnEl = document.querySelector(".search__btn");

const searchInputEl = document.getElementById("search__input");

const formMessage = document.querySelector(".form__message");

// console.log(cardContainerEl);
console.log(cardEl);
console.log(searchLinksEl);
console.log(searchBtnEl);
console.log(searchInputEl);

//  use moment to get the current date
const now = moment();
// format the date here

const todaysDt = now.format("dddd, MMMM D");

// query select the correct element on the page

const dateEl = document.querySelector(".date");

// insert the formatted date to dateEl element

dateEl.textContent = todaysDt;

// hiding the hard coded , weather cards, search links and the form message from the page

for (card of cardEl) {
  card.innerHTML = "";
}

searchLinksEl.innerHTML = "";

formMessage.innerHTML = "";

// helper functions

// function to check if the city is valid

const isCityValid = async (city) => {
  const queryUrl = `${apiUrl}${city}&appid=${apiKey}`;

  const request = new Request(queryUrl, { method: "GET" });

  const response = await fetch(request);

  console.log(response);

  return response.status;
};

// function to retrieve all previous search history from local storage

const getSearches = () => {
  // ternary operator evaluates truthy/falsy - searches local storage exists then it returns the parsed object to variable else it will return an empty array
  const getParsedSearches = window.localStorage.getItem("searches")
    ? JSON.parse(window.localStorage.getItem("searches"))
    : [];

  console.log(getParsedSearches);

  // lets return the parsed searches to this function

  return getParsedSearches;
};

const displayAllBtns = (parsedArr) => {
  console.log("inside of displayAllBtns function");

  const searches = parsedArr;

  // the above is the parsed array of objects returned from the getSearches function,
  // we need to loop through this array of objects and call 'generateAllBtns' and passing in the city property value to the function to generate all the buttons on the page

  for (search of searches) {
    // passing the city value to the variable
    const city = search.city;

    // lets invoke the generateBtn function with this value

    generateAllBtns(city);
  }
};

// function to store city searches to local storage

const storeSearchHistory = (city) => {
  console.log(citySearches);
  console.log(city);

  if (city) {
    // we should only add the city to local storage if it does not exist in local storage
    const exist = citySearches.findIndex((value) => value.city === city) > -1;

    console.log("exists", exist);

    if (!exist) {
      // pushing this to the array
      citySearches.push({ city: city });

      // saving the array to local storage

      window.localStorage.setItem("searches", JSON.stringify(citySearches));
      console.log(`${city} has been saved to local storage`);
    }
  }
};

// function to generate all the buttons currently stored to local storage

const generateAllBtns = (city) => {
  if (city) {
    //  creating the anchor element
    const a = document.createElement("a");
    // creating the elements textNode
    const aText = document.createTextNode(`${city}`);
    // appending textNode to the element
    a.appendChild(aText);
    //  adding the Bootstrap classes to the element
    a.classList.add("btn", "btn-primary", "mb-3");
    //   setting an attribute
    a.setAttribute("role", "button");
    // setting a custom data attr
    a.setAttribute("data-city", city);
    // appending the element to the page
    searchLinksEl.append(a);
  }
};

// function to generate a single button on the page at a time

const generateBtn = (city) => {
  console.log("inside of generatBtn function");
  // we should check if we have a city passed to this function and if true generate the button

  if (city) {
    // however before generating the button element, we need to check if the search already exists within local storage and only append a new button to the page when there is no city that matches what is stored within local storage - we can use the findIndex method above again for this method

    const exist = citySearches.findIndex((value) => value.city === city) > -1;

    console.log("exists", exist);

    if (!exist) {
      //  creating the anchor element
      const a = document.createElement("a");
      // creating the elements textNode
      const aText = document.createTextNode(`${city}`);
      // appending textNode to the element
      a.appendChild(aText);
      //  adding the Bootstrap classes to the element
      a.classList.add("btn", "btn-primary", "mb-3");
      //   setting an attribute
      a.setAttribute("role", "button");
      // setting a custom data attr
      a.setAttribute("data-city", city);
      // appending the element to the page
      searchLinksEl.append(a);
    }
  }
};

// function to get json data from the openweatherapi

const getJSON = async (city) => {
  try {
    // setting up the queryURL

    const queryURL = `${apiUrl}${city}&appid=${apiKey}`;

    const response = await fetch(queryURL, { method: "GET" });

    // we need to handle an error here

    if (response.status === 401) {
      throw new Error(response.status);
    }

    const dataJSON = await response.json();

    console.log(dataJSON);

    const { lon, lat } = dataJSON.coord;

    console.log(lon, lat);

    const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const forecastData = await fetch(urlForecast, { method: "GET" });

    // we need to handle an error here

    if (forecastData.status === 404) {
      throw new Error(forecastData.status);
    }

    const forecastDataJSON = await forecastData.json();

    return forecastDataJSON;
  } catch (error) {
    console.log(`${error}`);

    if (error === "Error: 401") {
      formMessage.textContent = ` ${error}: Invalid API key 🤬`;
    } else {
      formMessage.textContent = ` ${error}: Something went wrong 🤬`;
    }
  }
};

// N.B. i attempted to convert the above the json to string using json.stringify and then returning this to the function, and on recieving the stringified json i attempted to convert back to json, however i got an error -  which according to stack overflow https://stackoverflow.com/questions/38380462/syntaxerror-unexpected-token-o-in-json-at-position-1 is an error caused when the object you are passing is already an object. The solution was simply to pass the json object and since the json is a promise we need to attach an await for the promise to return fulfilled.

// function to display todays weather card

const displayTodayWeather = async (payload) => {
  console.log("Displaying todays weather card");

  // clearing the element when this function is executed
  for (card of cardEl) {
    card.innerHTML = "";
  }

  // using await here to return the promise fulfilled
  payload = await payload;

  console.log(payload);

  const city = payload.city;
  const weatherData = payload.list;

  const { dt_txt, main, weather, wind } = weatherData[0];

  // using momentjs to parse the date and extract only the time
  const forecastTime = moment(dt_txt).format("HH:mm");
  const day = moment(dt_txt).format("dddd");

  console.log(forecastTime);

  console.log(
    "city",
    city,
    "date time",
    dt_txt,
    "main",
    main,
    "weather",
    weather,
    "wind",
    wind
  );

  const markup = `
    
  <div class="card-body p-4">
    <div class="d-flex">
      <h6 class="flex-grow-1">${city.name}</h6>
      <h6>${day} until: ${forecastTime}</h6>
    </div>

    <div class="d-flex flex-column text-center mt-5 mb-4">
      <h6
        class="display-4 mb-0 font-weight-bold"
        style="color: #1c2331"
      >
      ${main.temp.toFixed(0)}°C
      </h6>
      <span class="small" style="color: #868b94">${
        weather[0].description
      }</span>
    </div>

    <div class="d-flex align-items-center">
      <div class="flex-grow-1" style="font-size: 1rem">
        <div>
          <i class="fa-solid fa-sun" style="color: #868b94"></i>
          <span class="ms-1">${main.temp.toFixed(0)} &#176; deg</span>
        </div>
        <div>
          <i class="fas fa-wind fa-fw" style="color: #868b94"></i>
          <span class="ms-1"> ${wind.speed.toFixed(0)} km/h </span>
        </div>
        <div>
          <i class="fa-solid fa-water" style="color: #868b94"></i>
          <span class="ms-1"> ${main.humidity}% </span>
        </div>
      </div>
      <div>
        <img
          src=" http://openweathermap.org/img/wn/${weather[0].icon}@2x.png"
          class="img-fluid" alt="weather-icon" width="150px"
         />
      </div>
    </div>
  </div>

    
    `;

  // without using the methods below the markup will be appended to the element as a string

  const cardFragment = document.createRange().createContextualFragment(markup);

  cardEl[0].appendChild(cardFragment);
};

// function to display five day weather forecast

const displayFiveDayWeather = async (payload) => {
  console.log("Displaying five day weather card");

  // clearing the element when this function is executed
  for (card of cardEl) {
    card.innerHTML = "";
  }

  // using await here to return the promise fulfilled
  payload = await payload;

  console.log(payload);

  const city = payload.city;
  const weatherData = payload.list;

  for (let i = 5; i < 40; i = i + 8) {
    const { dt_txt, main, weather, wind } = weatherData[i];

    // using momentjs to parse the date and extract only the time
    const forecastTime = moment(dt_txt).format("HH:mm");
    const day = moment(dt_txt).format("dddd");

    console.log(forecastTime);

    console.log(
      "city",
      city,
      "date time",
      dt_txt,
      "main",
      main,
      "weather",
      weather,
      "wind",
      wind
    );

    const markup = `
    
  <div class="card-body p-4">
    <div class="d-flex">
      <h6 class="flex-grow-1">${city.name}</h6>
      <h6>${day} until: ${forecastTime}</h6>
    </div>

    <div class="d-flex flex-column text-center mt-5 mb-4">
      <h6
        class="display-4 mb-0 font-weight-bold"
        style="color: #1c2331"
      >
      ${main.temp.toFixed(0)}°C
      </h6>
      <span class="small" style="color: #868b94">${
        weather[0].description
      }</span>
    </div>

    <div class="d-flex align-items-center">
      <div class="flex-grow-1" style="font-size: 1rem">
        <div>
          <i class="fa-solid fa-sun" style="color: #868b94"></i>
          <span class="ms-1">${main.temp.toFixed(0)} &#176; deg</span>
        </div>
        <div>
          <i class="fas fa-wind fa-fw" style="color: #868b94"></i>
          <span class="ms-1"> ${wind.speed.toFixed(0)} km/h </span>
        </div>
        <div>
          <i class="fa-solid fa-water" style="color: #868b94"></i>
          <span class="ms-1"> ${main.humidity}% </span>
        </div>
      </div>
      <div>
        <img
          src=" http://openweathermap.org/img/wn/${weather[0].icon}@2x.png"
          class="img-fluid" alt="weather-icon" width="150px"
         />
      </div>
    </div>
  </div>

    
    `;

    // without using the methods below the markup will be appended to the element as a string

    const cardFragment = document
      .createRange()
      .createContextualFragment(markup);

    cardEl[1].appendChild(cardFragment);
  }
};

// function to listen to search links

const searchBtns = () => {
  searchLinksEl.addEventListener("click", function (e) {
    e.preventDefault();

    console.log("search link clicked");

    // getting the target link clicked on
    linkTarget = e.target;
    // getting the location searched for via custom data attr
    const city = linkTarget.dataset.city;

    // invoking both functions to display todays forecast and five day forecast

    displayTodayWeather(getJSON(city));
    displayFiveDayWeather(getJSON(city));
  });
};

searchBtns();

// creating a function to listen to the form button

const searchEvent = async () => {
  // adding an event listener to the forms search button

  searchBtnEl.addEventListener("click", async function (e) {
    e.preventDefault();

    console.log("search button clicked");
    // getting the input from form input text field
    const searchVal = searchInputEl.value.trim().toLowerCase();

    console.log(searchVal);
    // error handler for when no text entered in search field
    if (!searchVal) {
      formMessage.textContent = `Please enter a city name ! 😲`;
    }

    // when there is some text entered and search button clicked
    // when search button is clicked then check if the city entered is valid city
    const status = await isCityValid(searchVal);

    if (status === 404) {
      formMessage.textContent = `The city does not exist, please try again! 😲`;
    }

    if (status === 200) {
      // if the user enters the same search that already exists form message is displayed to the page
      const alreadySearched = citySearches.some(
        (element) => element.city === searchVal
      );

      if (alreadySearched) {
        formMessage.textContent = `You have already searched for that city! 😯`;
      }
      // N.b. we need to execute the generateBtn function before saving to local storage
      //generate the button element
      generateBtn(searchVal);
      // store the valid form input to local storage
      storeSearchHistory(searchVal);

      if (!alreadySearched) {
        // invoking the function to display the card for todays forecast to the page
        displayTodayWeather(getJSON(searchVal));
        displayFiveDayWeather(getJSON(searchVal));
      }
    }
  });

  // if form message exists clears the form message when user begins to type in to search field
  searchInputEl.addEventListener("input", function () {
    if (formMessage) {
      formMessage.innerHTML = "";
    }
  });
};

searchEvent();
displayAllBtns(getSearches());
