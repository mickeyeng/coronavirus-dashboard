import { displayMap } from './map.js';
import { showChart } from './charts.js';

const search = document.querySelector('[data-form]');
const allCases = document.querySelector('[data-all-cases');
const searchCases = document.querySelector('[data-search-cases');
const select = document.querySelector('select');

const API_URL = `https://corona.lmao.ninja`;
const API_BACKUP_URL = `https://coronavirus-19-api.herokuapp.com/all`;

// Fetch all country data
async function fetchAllData() {
  try {
    const response = await fetch(`${API_URL}/all`);
    const data = await response.json();
    console.log(data);
    updateDomCases(data);
    // showChart(data);
  } catch (error) {
    throw ('Error fetching all data', error);
  }
}

// list countries in the select
async function listCountries() {
  try {
    const response = await fetch(`${API_URL}/countries`);
    const data = await response.json();

    for (let value of data) {
      const option = document.createElement('option');
      option.text = value.country;
      option.value = value.country;
      select.add(option);
    }
  } catch (error) {
    throw ('Error fetching all country data', error);
  }
}

async function searchCountries(country = 'uk') {
  try {
    const response = await fetch(`${API_URL}/countries/${country}`);
    const data = await response.json();
    updateDomSearchCountries(data, country);
    searchHistory(country);
    displayMap(data);

    // console.log(data.countryInfo);

    search.addEventListener('submit', (e) => {
      e.preventDefault();
      const term = e.target.children[0].value;
      term === '' ? alert('error') : searchCountries(term);
    });
  } catch (error) {
    throw ('Error fetching specific country data', error);
    // searchCases.innerHtml = `<div>Error: ${error}</div>`;
  }
}

function updateDomCases(data) {
  const { deaths, recovered, cases } = data;
  allCases.innerHTML = `
    <div class="box-text">Number Of Cases: <span>${cases}</span></div>
    <div class="box-text">Number Of Deaths: <span>${deaths}</span></div>
    <div class="box-text">Number Of Recoveries: <span>${recovered}</span></div>
  `;
}

async function searchHistoryAndCases() {
  // const history = fetch(`${API_URL}/v2/historical/all`);
  // const allCases = fetch(`${API_URL}/all`);
  // // will return an array of the 2 values
  // Promise.all([allCases, history]).then((values) => {
  //   // convert both of the responses to json
  //   return Promise.all(values.map((value) => value.json())).then((data) => {
  //     // console.log(data)
  //     showChart(data);
  //   });
  // });
  // try {
  //   const response = await fetch(`${API_URL}/v2/historical/all`);
  //   const data =
  // } catch(error) {
  //   console.log(error)
  // }
}

async function searchAllHistory() {
  try {
    const allResponse = await fetch(`${API_URL}/all`);
    const allData = await allResponse.json();

    const historyResponse = await fetch(`${API_URL}/v2/historical/all`);
    const historyData = await historyResponse.json();
    showChart(historyData, allData);
  } catch (error) {
    throw ('Error fetching history data', error);
  }
}

async function searchHistory(country) {
  try {
    const response = await fetch(
      `https://corona.lmao.ninja/v2/historical/${country}`
    );
    const data = await response.json();
    const { deaths } = data.timeline;
    data.open = false;
    updateDomSearchHistory(deaths, data);
  } catch (error) {
    throw ('Error fetching history data', error);
  }
}

function updateDomSearchHistory(deaths, data) {
  const dropdownIcon = document.querySelector('[data-dropdown]');
  const historyWrapper = document.querySelector('.history-wrapper');
  const entries = Object.entries(deaths);

  entries.map((ent) => {
    const historyDivDate = document.createElement('div');
    if (!data.open) {
      historyWrapper.appendChild(historyDivDate).classList.add('history-date');
      historyDivDate.innerHTML = `
        <div>Date: ${ent[0]} - Deaths: ${ent[1]}</div>
      `;
    }
  });

  dropdownIcon.addEventListener('click', () => {
    const historyDate = document.querySelector('.history-date');
    const children = [...historyWrapper.children];

    // remove the active class on toggle icon
    children.forEach((child) =>
      child.classList.toggle('history-date_expanded')
    );

    // set the transition with max-height
    if (historyDate.classList.contains('history-date_expanded')) {
      historyWrapper.style.maxHeight = '300px';
      historyWrapper.style.overflowY = 'scroll';
      dropdownIcon.style.transform = 'rotate(180deg)';
      // historyWrapper.scrollHeight + 'px';
      console.log('open');
    } else {
      dropdownIcon.style.transform = 'rotate(0)';
      historyWrapper.style.maxHeight = '50px';
      historyWrapper.style.overflow = 'hidden';
      console.log('closed');
    }
  });
}

function updateDomSearchCountries(data, country) {
  if (data !== undefined) {
    searchCases.innerHTML = `
      <div class="country-info-header">
        <h1 class="country-search-heading">Coronavirus in ${
          country.charAt(0).toUpperCase() + country.slice(1)
        }</h1>
          <img class="flag" src=${data.countryInfo.flag} />
      </div>
      <div class="history-wrapper">

        <i class="fas fa-2x fa-angle-double-down dropdown-icon" data-dropdown></i>
          View History      
      </div>
      <div class="country-case-text">Active - <span>${data.active}</span></div>
      <div class="country-case-text">Cases - <span>${data.cases}</span></div>
      <div class="country-case-text">Critical - <span>${
        data.critical
      }</span></div>
      <div class="country-case-text">Deaths <span>${data.deaths}</span></div>
      <div class="country-case-text">Recovered - <span>${
        data.recovered
      }</span></div>
      <div class="country-case-text">Today Cases - <span>${
        data.todayCases
      }</span></div>
      <div class="country-case-text">Today Deaths - <span>${
        data.todayDeaths
      }</span></div>
    `;
  } else {
    console.log('error, country not found');
  }
}

select.addEventListener('change', (e) => searchCountries(e.target.value));

fetchAllData();
searchCountries();
listCountries();
searchAllHistory();
searchHistoryAndCases();
