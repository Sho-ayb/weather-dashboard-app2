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
*/

console.log("index.js file loaded");

// Global variables

const apiKey = "d0af7ceac9a3501bc47a8577610395a2";

const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";

// creating array to hold the users city searches

const citySearches = window.localStorage.getItem("searches")
  ? JSON.parse(window.localStorage.getItem("searches"))
  : [];

// Query selecting page elements

const cardContainerEl = document.getElementsByClassName("card__container");

const searchLinksEl = document.querySelector(".search__links");

const searchBtnEl = document.querySelector(".search__btn");

const searchInputEl = document.getElementById("search__input");

const formMessage = document.querySelector(".form__message");

console.log(cardContainerEl);
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

// hiding the hard coded search links, weather cards and the form message from the page

for (card of cardContainerEl) {
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
      // appending the element to the page
      searchLinksEl.append(a);
    }
  }
};

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
      // N.b. we need to execute the generateBtn function before saving to local storage
      //generate the button element
      generateBtn(searchVal);
      // store the valid form input to local storage
      storeSearchHistory(searchVal);
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
