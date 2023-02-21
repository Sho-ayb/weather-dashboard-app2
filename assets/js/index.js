console.log("index.js file loaded");

//  use moment to get the current date
const now = moment();
// format the date here

const todaysDt = now.format("dddd, MMMM D");

// query select the correct element on the page

const dateEl = document.querySelector(".date");

console.log(dateEl);

// insert the formatted to the dateEl

dateEl.textContent = todaysDt;
