'use strict';

const axios = require('axios');

async function getLocalData(source) {
  try {
    const apiResponse = await axios.get(`http://localhost:3004/${source}`);
    return apiResponse.data;
  } catch (e) {
    return e;
  }
};

function showData(data, source) {
  const resultsName = source == "Local Data" ? "localData" : "globalData";
  const resultsElement = document.querySelector(`.${resultsName}`);
  console.log(data);
  resultsElement.innerHTML = "Check the console to see the results :)";
};

exports.orderData = (source, nameOfSource) => {
  getLocalData(source)
    .then(function(response) {
      const apiResponse = response;
      const source = nameOfSource;
      const orderedData = apiResponse.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
      const finalData = orderedData.map(thisResponse => {
        thisResponse.source = source;
        return thisResponse;
      });
      showData(finalData, source);
    });
};