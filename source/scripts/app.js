'use strict';

require('../styles/app.sass');
const data = require('./modules/getData');

const localButton = document.querySelector(".getLocal");
const globalButton = document.querySelector(".getGlobal");

localButton.addEventListener("click", () => {
  data.orderData("GetLocalPressReleases", "Local Data");
});

globalButton.addEventListener("click", () => {
  data.orderData("GetGlobalPressReleases", "Global Data");
});

