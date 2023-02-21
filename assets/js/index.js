console.log("index.js file loaded");

// Global variables

const apiKey = "d0af7ceac9a3501bc47a8577610395a2";

// Query selecting page elements

const cardContainerEl = document.getElementsByClassName("card__container");

const searchLinksEl = document.querySelector(".search__links");

const searchBtnEl = document.querySelector(".search__btn");

const searchInputEl = document.getElementById("search__input");

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

// hiding the hard coded search links and weather cards from the page

for (card of cardContainerEl) {
  card.innerHTML = "";
}

searchLinksEl.innerHTML = "";

// creating a function to listen to the form button

const searchEvent = () => {
  // adding an event listener to the forms search button

  searchBtnEl.addEventListener("click", function (e) {
    e.preventDefault();

    console.log("search button clicked");

    const searchVal = searchInputEl.value.trim().toLowerCase();

    console.log(searchVal);
  });
};

searchEvent();
