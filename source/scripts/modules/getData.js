'use strict';

const axios = require('axios');

function showData(data) {
  const resultsElement = document.querySelector(".pressData");
  console.log(data);
  resultsElement.innerHTML = "Check the console to see the results :)";
};

function orderData(localData, globalData) {
  const allData = [];

  localData.map(thisLocalData => {
    thisLocalData.source = "Local Data";
    allData.push(thisLocalData);
    return allData;
  });

  globalData.map(thisGlobalData => {
    thisGlobalData.source = "Global Data";
    allData.push(thisGlobalData);
    return allData;
  });

  const orderedData = allData.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));

  showData(orderedData);
}

async function getAllData() {
  try {
    const localPressPromise = axios.get("http://localhost:3004/GetLocalPressReleases");
    const globalPressPromise = axios.get("http://localhost:3004/GetGlobalPressReleases");
    const [localPress, globalPress] = await Promise.all([localPressPromise, globalPressPromise]);
    orderData(localPress.data, globalPress.data);
  } catch (e) {
    return e;
  }
};

export { getAllData };
