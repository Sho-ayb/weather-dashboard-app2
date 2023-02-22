console.log("index.js file loaded");

// Global variables

const apiKey = "d0af7ceac9a3501bc47a8577610395a2";

const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";

// creating array to hold the users city searches

const citySearches = window.localStorage.getItem("cities")
  ? JSON.parse(window.localStorage.getItem("cities"))
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

    const status = await isCityValid(searchVal);

    if (status === 404) {
      formMessage.textContent = `The city does not exist, please try again! 😲`;
    }
  });

  // if form message exists clears the form message when user begins to type in to search field
  searchInputEl.addEventListener("input", function () {
    if (formMessage) {
      formMessage.innerHTML = "";
    }
  });

  // when there is some text entered and search button clicked
  // when search button is clicked then check if the city entered is valid city
};

// function to check if the city is valid

const isCityValid = async (city) => {
  const queryUrl = `${apiUrl}${city}&appid=${apiKey}`;

  const request = new Request(queryUrl, { method: "GET" });

  const response = await fetch(request);

  console.log(response);

  return response.status;
};

// function to store city searches to local storage

const storeSearchHistory = (city) => {};

searchEvent();
