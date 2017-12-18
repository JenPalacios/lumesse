'use strict';

require('../styles/app.sass');
import {getAllData} from './modules/getData';

const getPressButton = document.querySelector(".getReleases");

getPressButton.addEventListener("click", () => {
  getAllData();
});

