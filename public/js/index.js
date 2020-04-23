import { displayMap } from './map.js';
import { showChartHistory, showChartHistoryByCountry } from './charts.js';
import {
  capitaliseFirstLetter,
  icons,
  mainColors,
  formatter,
  loader,
} from './util.js';

const search = document.querySelector('[data-form]');
const allCases = document.querySelector('[data-all-cases]');
const searchCases = document.querySelector('[data-search-cases]');
const select = document.querySelector('select');
const loading = document.querySelector('[data-loader]');
// const loadingGraph = document.querySelector('[data-loader-all]');
const mainChartLoader = document.querySelector('[data-main-chart]');

const API_URL = `https://corona.lmao.ninja/v2`;
const API_BACKUP_URL = `https://coronavirus-19-api.herokuapp.com/all`;

// Fetch all country data
async function fetchAllData() {
  try {
    const response = await fetch(`${API_URL}/alll`);

    if (response.status === 200) {
      const data = await response.json();
      console.log('fetch all data', response.status);
      updateDomCases(data);
    } else {
      loader(loading);
    }
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
      select.add(option);
    }
  } catch (error) {
    throw ('Error fetching all country data', error);
  }
}

// search for countries in the search box
async function searchCountries(country = 'uk') {
  try {
    const response = await fetch(`${API_URL}/countriesss/${country}`);
    if (response.status === 200) {
      const data = await response.json();
      updateDomSearchCountries(data, country);
      searchHistory(country);
      displayMap(data);
    } else {
      setTimeout(() => {
        loader(searchCases);
      }, 1000);
      searchCases.style.border = 'none';
      searchCases.style.boxShadow = 'none';
    }
  } catch (error) {
    throw ('Error fetching specific country data', error);
    // searchCases.innerHtml = `<div>Error: ${error}</div>`;
  }
}

function updateDomCases(data) {
  const objectArray = Object.entries(data);
  const filteredArray = objectArray.filter(
    (el, index) =>
      index !== 0 &&
      index !== 8 &&
      index !== 7 &&
      index !== 8 &&
      index !== 9 &&
      // index !== 10 &&
      index !== 11 &&
      index !== 12
  );

  filteredArray.map(([key, value], index) => {
    const iconValues = Object.values(icons);
    const colors = Object.values(mainColors);
    const icon = iconValues[index];
    const color = colors[index];

    const allCasesBox = document.createElement('div');
    allCasesBox.classList.add('all-cases-box');
    const allCasesBoxTagWrapper = document.createElement('div');
    allCasesBoxTagWrapper.classList.add('icon-wrapper');
    const allCasesBoxTag = document.createElement('i');
    allCasesBoxTag.classList.add('fas', `${icon}`, 'fa-2x', 'icon');
    allCasesBoxTagWrapper.style.background = color;
    const allCasesBoxHeading = document.createElement('h2');
    allCasesBoxHeading.classList.add('all-cases-box-heading');
    const allCasesBoxNumber = document.createElement('h1');
    const allCasesBottomDiv = document.createElement('div');
    allCasesBottomDiv.classList.add('all-cases-box__bottom-div');
    allCasesBoxNumber.classList.add('all-cases-box-number');
    allCases.appendChild(allCasesBox);
    allCasesBox.appendChild(allCasesBoxTagWrapper);
    allCasesBoxTagWrapper.appendChild(allCasesBoxTag);
    allCasesBox.appendChild(
      allCasesBoxHeading
    ).innerText = capitaliseFirstLetter(key);
    allCasesBox.appendChild(allCasesBoxNumber).innerText = formatter.format(
      value
    );
    allCasesBox.appendChild(allCasesBottomDiv);
    allCasesBottomDiv.style.background = color;
  });
}

// Search history in the chart for worldwide data
async function searchAllHistory() {
  try {
    const response = await fetch(`${API_URL}/historicassl/all`);
    console.log('search al history', response.status);

    if (response.status === 200) {
      const data = await response.json();
      showChartHistory(data);
    } else {
      loader(mainChartLoader);
    }
  } catch (error) {
    throw ('Error fetching history data', error);
  }
}

// Search history by country and output to chart
async function searchHistory(country) {
  try {
    const response = await fetch(`${API_URL}/historicalll/${country}`);
    if (response.status === 200) {
      const data = await response.json();
      const { deaths } = data.timeline;
      data.open = false;
      updateDomSearchHistory(deaths, data);
      showChartHistoryByCountry(data);
    } else {
      loader(searchCases);
    }
  } catch (error) {
    throw ('Error fetching history data', error);
  }
}

// show data for country in the cases boxes
function updateDomSearchHistory(deaths, data) {
  const dropdownIcon = document.getElementById('dropdown');
  const historyWrapper = document.querySelector('.history-wrapper');
  const entries = Object.entries(deaths);

  entries.map((ent) => {
    const historyDivDate = document.createElement('div');
    const historyInfoDiv = document.createElement('div');
    historyInfoDiv.classList.add('history-date-info-text');
    historyInfoDiv.textContent = `Date: ${ent[0]} - Deaths: ${ent[1]}`;
    if (!data.open) {
      historyWrapper.appendChild(historyDivDate).classList.add('history-date');
      historyDivDate.appendChild(historyInfoDiv);
    }
  });

  // show country history info on dropdown click
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
      historyWrapper.style.maxHeight = '60px';
      historyWrapper.style.overflow = 'hidden';
      console.log('closed');
    }
  });
}

// update DOM with data for specific country
function updateDomSearchCountries(data, country) {
  if (data !== undefined) {
    searchCases.innerHTML = ``;
    const countryInfoHeader = document.createElement('div');
    searchCases.appendChild(countryInfoHeader);
    countryInfoHeader.classList.add('country-info-header');

    const countryInfoSearchHeading = document.createElement('h1');
    countryInfoSearchHeading.classList.add('country-search-heading');
    countryInfoSearchHeading.innerText = `Coronavirus in ${capitaliseFirstLetter(
      country
    )}`;
    countryInfoHeader.appendChild(countryInfoSearchHeading);

    const countryImage = document.createElement('img');
    countryImage.classList.add('flag');
    countryImage.src = data.countryInfo.flag;
    countryInfoHeader.appendChild(countryImage);

    const toggleChart = document.createElement('div');
    // toggleChart.textContent = 'Bar Chart';
    // toggleChart.id = 'toggle-chart';
    // toggleChart.classList.add('toggle');

    const toggleMap = toggleChart.cloneNode();
    toggleMap.classList.add('toggle');
    toggleMap.id = 'toggle-map';
    toggleMap.textContent = 'Map';
    searchCases.appendChild(toggleMap);
    searchCases.appendChild(toggleChart);

    const showGraphAndMapWrapper = document.createElement('div');
    showGraphAndMapWrapper.id = 'show-visual-wrapper';
    const mapDiv = document.createElement('div');
    mapDiv.classList.add('map', 'active', 'active-map');
    showGraphAndMapWrapper.appendChild(mapDiv);
    searchCases.appendChild(showGraphAndMapWrapper);

    const historyWrapper = document.createElement('div');
    historyWrapper.classList.add('history-wrapper');
    searchCases.appendChild(historyWrapper);

    const historyWrapperDropdown = historyWrapper.cloneNode();
    historyWrapperDropdown.classList.add('history-wrapper__dropdown-text');
    historyWrapperDropdown.classList.remove('history-wrapper');
    historyWrapper.appendChild(historyWrapperDropdown);

    const dropdownIcon = document.createElement('i');
    dropdownIcon.classList.add(
      'fas',
      'fa-2x',
      'fa-angle-double-down',
      'dropdown-icon'
    );
    dropdownIcon.id = 'dropdown';
    historyWrapperDropdown.textContent = 'View History';
    historyWrapperDropdown.appendChild(dropdownIcon);

    const countryCaseText = document.createElement('div');
    countryCaseText.classList.add('country-case-text');
    searchCases.appendChild(countryCaseText);

    const filteredArrayCountry = Object.entries(data).filter((data, index) => {
      return (
        index !== 0 &&
        index !== 1 &&
        index !== 2 &&
        index !== 9 &&
        index !== 10 &&
        index !== 11 &&
        index !== 13
      );
    });

    filteredArrayCountry.map((info, index) => {
      const iconValues = Object.values(icons);
      const icon = iconValues[index];
      const countryCaseTextBox = document.createElement('div');
      countryCaseTextBox.classList.add('country-case-text__box');
      countryCaseText.appendChild(countryCaseTextBox);

      const countrySpan = document.createElement('span');
      countrySpan.textContent = formatter.format(info[1]);
      countryCaseTextBox.textContent = `${capitaliseFirstLetter(info[0])} - `;
      countryCaseTextBox.appendChild(countrySpan);

      const divStyle = document.createElement('div');
      divStyle.classList.add('country-case-box-text__box-style');
      countryCaseTextBox.appendChild(divStyle);
      const iconTag = document.createElement('i');
      iconTag.classList.add('fas', icon);
      iconTag.id = 'box-style__tag';
      divStyle.appendChild(iconTag);
    });
  } else {
    console.log('error, country not found');
  }

  // change this!!!!
  const divs = document.querySelector('.country-case-text');
  const newArr = [...divs.children];

  const arrWithColors = newArr.map((child, index) => {
    const colors = Object.values(mainColors);
    const color = colors[index];
    child.style.borderBottom = `5px solid ${color}`;
    child.lastElementChild.style.background = color;
  });
}

// search countries based on search term
search.addEventListener('submit', (e) => {
  e.preventDefault();
  const term = e.target.children[0].value;
  term === '' ? alert('error') : searchCountries(term);
});

// invoke the search countries function in the country select with what the user selects
select.addEventListener('change', (e) => searchCountries(e.target.value));

fetchAllData();
searchCountries();
listCountries();
searchAllHistory();
