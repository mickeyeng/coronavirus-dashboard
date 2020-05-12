import { displayMap } from './map.js';
import { showChartHistory, showChartHistoryByCountry } from './charts.js';
import {
  capitaliseFirstLetter,
  icons,
  mainColors,
  formatter,
  loader,
  selectObjKeys,
} from './util.js';

const search = document.querySelector('[data-form]');
const worldwideStats = document.querySelector('[data-worldwide-stats]');

const searchCountryStats = document.querySelector('[data-search-stats]');
const select = document.querySelector('select');
const loading = document.querySelector('[data-loader]');
const main = document.querySelector('#main');
const API_BASE_URL = `https://disease.sh/v2`;

async function fetchData(url_path, callback) {
  try {
    const response = await fetch(`${API_BASE_URL}/${url_path}`);
    if (response.status === 200) {
      const data = await response.json();
      callback(data);
    } else {
      setTimeout(() => {
        loader(loading);
      }, 1000);
    }
  } catch (error) {
    throw ('Error fetching all data', error);
  }
}

async function listCountriesInSelect() {
  try {
    const response = await fetch(`${API_BASE_URL}/countries`);
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

async function searchCountries(country = 'uk') {
  try {
    const response = await fetch(`${API_BASE_URL}/countries/${country}`);
    if (response.status === 200) {
      const data = await response.json();
      updateUISearchCountries(data, country);
      searchHistoryChart(country);
      displayMap(data);
    } else {
      alert(`The country ${country} doesn't exist. Please try again`);
      setTimeout(() => {
        loader(searchCountryStats);
      }, 1000);
    }
  } catch (error) {
    throw ('Error fetching specific country data', error);
  }
}

const filterWorldwideStats = (worldwideData) => {
  return selectObjKeys(worldwideData, WORLDWIDE_STATS);
};

function createWorldwideStatBox() {
  const worldwideStatsBox = document.createElement('div');
  worldwideStatsBox.classList.add('worldwide-stats-box');
  worldwideStats.insertAdjacentElement('afterbegin', worldwideStatsBox);
}

function createWorldwideStatBoxIcon(className, color) {
  const worldwideStatsBox = document.querySelector('.worldwide-stats-box');
  const iconWrapper = document.createElement('div');
  iconWrapper.classList.add('icon-wrapper');
  const icon = document.createElement('i');
  icon.classList.add('fas', className, 'fa-2x', 'icon');
  iconWrapper.style.background = color;
  iconWrapper.appendChild(icon);
  worldwideStatsBox.appendChild(iconWrapper);
}

function createWorldwideStatBoxText(caseText, caseNumberValue) {
  const worldwideStatsBox = document.querySelector('.worldwide-stats-box');
  const caseHeading = document.createElement('h2');
  caseHeading.classList.add('worldwide-stats-box-heading');
  const caseNumber = document.createElement('h1');
  caseNumber.classList.add('worldwide-stats-box-number');
  worldwideStatsBox.appendChild(caseHeading).innerText = capitaliseFirstLetter(
    caseText
  );
  worldwideStatsBox.appendChild(caseNumber).innerText = formatter.format(
    caseNumberValue
  );
}

function createWorldwideStatBoxBottomBorder(color) {
  const worldwideStatsBox = document.querySelector('.worldwide-stats-box');
  const bottomDiv = document.createElement('div');
  bottomDiv.classList.add('worldwide-stats-box__bottom-div');
  bottomDiv.style.background = color;
  worldwideStatsBox.appendChild(bottomDiv);
}

function updateUIWorldwideStats(data) {
  // css afterbegin reverses the array
  const worldwideStats = filterWorldwideStats(data).reverse();
  worldwideStats.forEach(([key, value], index) => {
    const icon = icons[index];
    const color = mainColors[index];
    // ****** MAIN BOX ******
    createWorldwideStatBox();
    // ****** ICON ******
    createWorldwideStatBoxIcon(icon, color);
    // ****** BOX TEXT ******
    createWorldwideStatBoxText(key, value);
    // ****** BOX bottom border div  ******
    createWorldwideStatBoxBottomBorder(color);
  });
}

// Search history by country and output to chart
async function searchHistoryChart(country) {
  try {
    const response = await fetch(`${API_BASE_URL}/historical/${country}`);
    if (response.status === 200) {
      const data = await response.json();
      const { deaths } = data.timeline;
      data.open = false;
      updateUISearchCountryHistory(deaths, data);
      showChartHistoryByCountry(data);
    } else {
      loader(searchCountryStats);
    }
  } catch (error) {
    throw ('Error fetching history data', error);
  }
}

// show data for country in the stats boxes
function updateUISearchCountryHistory(deaths, data) {
  const dropdownIcon = document.getElementById('dropdown');
  const historyWrapper = document.querySelector('.history-wrapper');
  const deathsHistory = Object.entries(deaths);

  deathsHistory.forEach((ent) => {
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
    } else {
      dropdownIcon.style.transform = 'rotate(0)';
      historyWrapper.style.maxHeight = '60px';
      historyWrapper.style.overflow = 'hidden';
    }
  });
}

const testData = {
  updated: 1588729215153,
  cases: 3726701,
  todayCases: 2184,
  deaths: 258295,
  todayDeaths: 268,
  recovered: 1241908,
  active: 2226498,
  critical: 49248,
  casesPerOneMillion: 478,
  deathsPerOneMillion: 33,
  tests: 40360974,
  testsPerOneMillion: 5176.8,
  affectedCountries: 214,
};

const WORLDWIDE_STATS = [
  'cases',
  'todayCases',
  'deaths',
  'todayDeaths',
  'recovered',
  'active',
  'tests',
];

const oldResult = JSON.stringify();
const newResult = JSON.stringify();

console.log(
  'test result: ' +
    (newResult === oldResult
      ? 'PASSED!'
      : 'FAILED! ' + '\n new: ' + newResult + '\n \n  old: ' + oldResult)
);

const createCountryHeader = () => {
  const countryInfoHeader = document.createElement('div');
  countryInfoHeader.classList.add('country-info-header');
  searchCountryStats.appendChild(countryInfoHeader);
};

const createCountryInfoHeaderText = () => {
  const countryInfoHeaderText = document.createElement('h1');
  countryInfoHeaderText.classList.add('country-search-heading');
  countryInfoHeaderText.innerText = `Coronavirus in ${capitaliseFirstLetter(
    country
  )}`;
  countryInfoHeader.appendChild(countryInfoHeaderText);
};

const createCountryInfoFlag = () => {
  const countryImage = document.createElement('img');
  countryImage.classList.add('flag');
  countryImage.src = data.countryInfo.flag;
  countryInfoHeader.appendChild(countryImage);
};

const createMapAndChartButtons = () => {
  const toggleChart = document.createElement('div');
  const toggleMap = document.createElement('div');
  toggleMap.classList.add('toggle');
  toggleMap.id = 'toggle-map';
  toggleMap.textContent = 'Map';
  searchCountryStats.appendChild(toggleMap);
  searchCountryStats.appendChild(toggleChart);
};

const createChartContainer = () => {
  const chartContainer = document.createElement('div');
  chartContainer.classList.add('chart-container');
  chartContainer.id = 'chart-container-country';
};

const createMapDiv = () => {
  const map = document.createElement('div');
  map.classList.add('map', 'active', 'active-map');
  showGraphAndMapWrapper.appendChild(map);
};

const createCountryHistoryWrapper = () => {
  const historyWrapper = document.createElement('div');
  historyWrapper.classList.add('history-wrapper');
  searchCountryStats.appendChild(historyWrapper);
};

const createCountryHistoryDropdownText = () => {
  const historyWrapperDropdown = historyWrapper.cloneNode();
  historyWrapperDropdown.classList.add('history-wrapper__dropdown-text');
  historyWrapperDropdown.classList.remove('history-wrapper');
  historyWrapper.appendChild(historyWrapperDropdown);
};

const createCountryHistoryDropdownIcon = () => {
  const dropdownIcon = document.createElement('i');
  dropdownIcon.classList.add(
    'fas',
    'fa-2x',
    'fa-angle-double-down',
    'dropdown-icon'
  );
  dropdownIcon.id = 'dropdown';
  historyWrapperDropdown.appendChild(dropdownIcon);
};
// update UI with data for specific country
function updateUISearchCountries(data, country) {
  if (data !== undefined) {
    searchCountryStats.innerHTML = ``;

    // ****** COUNTRY INFO HEADER ******
    const countryInfoHeader = document.createElement('div');
    countryInfoHeader.classList.add('country-info-header');
    searchCountryStats.appendChild(countryInfoHeader);

    // ****** COUNTRY INFO HEADER TEXT ******
    const countryInfoHeaderText = document.createElement('h1');
    countryInfoHeaderText.classList.add('country-search-heading');
    countryInfoHeaderText.innerText = `Coronavirus in ${capitaliseFirstLetter(
      country
    )}`;
    countryInfoHeader.appendChild(countryInfoHeaderText);

    // ****** COUNTRY INFO FLAG ******
    const countryImage = document.createElement('img');
    countryImage.classList.add('flag');
    countryImage.src = data.countryInfo.flag;
    countryInfoHeader.appendChild(countryImage);

    // ****** TOGGLE CHART AND MAP ******
    const toggleChart = document.createElement('div');
    const toggleMap = document.createElement('div');
    toggleMap.classList.add('toggle');
    toggleMap.id = 'toggle-map';
    toggleMap.textContent = 'Map';
    searchCountryStats.appendChild(toggleMap);
    searchCountryStats.appendChild(toggleChart);

    // ******  CHART CONTAINER ******
    const chartContainer = document.createElement('div');
    chartContainer.classList.add('chart-container');
    chartContainer.id = 'chart-container-country';

    // ******  SHOW GRAPH AND MAP WRAPPER ******
    const showGraphAndMapWrapper = document.createElement('div');
    showGraphAndMapWrapper.id = 'show-visual-wrapper';
    showGraphAndMapWrapper.appendChild(chartContainer);
    searchCountryStats.appendChild(showGraphAndMapWrapper);

    // ******  MAP DIV ******
    const map = document.createElement('div');
    map.classList.add('map', 'active', 'active-map');
    showGraphAndMapWrapper.appendChild(map);

    // ******  COUNTRY HISTORY WRAPPER ******
    const historyWrapper = document.createElement('div');
    historyWrapper.classList.add('history-wrapper');
    searchCountryStats.appendChild(historyWrapper);

    // ******  COUNTRY HISTORY DROPDOWN TEXT ******
    const historyWrapperDropdown = historyWrapper.cloneNode();
    historyWrapperDropdown.classList.add('history-wrapper__dropdown-text');
    historyWrapperDropdown.classList.remove('history-wrapper');
    historyWrapperDropdown.textContent = 'View History';
    historyWrapper.appendChild(historyWrapperDropdown);

    // ******  CREATE COUNTRY HISTORY DROPDOWN ICON ******
    const dropdownIcon = document.createElement('i');
    dropdownIcon.classList.add(
      'fas',
      'fa-2x',
      'fa-angle-double-down',
      'dropdown-icon'
    );
    dropdownIcon.id = 'dropdown';
    historyWrapperDropdown.appendChild(dropdownIcon);

    // ******  CREATE COUNTRY STAT BOX ******
    const countryStatText = document.createElement('div');
    countryStatText.classList.add('country-stats-wrapper');
    searchCountryStats.appendChild(countryStatText);

    const filteredArrayCountry = Object.entries(data).filter((data, index) => {
      return (
        index !== 0 &&
        index !== 1 &&
        index !== 2 &&
        index !== 9 &&
        index !== 10 &&
        index !== 11 &&
        index !== 13 &&
        index !== 14
      );
    });

    filteredArrayCountry.map((info, index) => {
      const iconValues = Object.values(icons);
      const icon = iconValues[index];
      const countryStatTextBox = document.createElement('div');
      countryStatTextBox.classList.add('country-stat-text__box');
      countryStatText.appendChild(countryStatTextBox);

      const countrySpan = document.createElement('span');
      countrySpan.textContent = formatter.format(info[1]);
      countryStatTextBox.textContent = `${capitaliseFirstLetter(info[0])} - `;
      countryStatTextBox.appendChild(countrySpan);

      const divStyle = document.createElement('div');
      divStyle.classList.add('country-stat-box-text__box-style');
      countryStatTextBox.appendChild(divStyle);
      const iconTag = document.createElement('i');
      iconTag.classList.add('fas', icon);
      iconTag.id = 'box-style__tag';
      divStyle.appendChild(iconTag);
    });
  } else {
    console.log('error, country not found');
  }

  const countryStatsDivs = document.querySelector('.country-stats-wrapper');
  const countryStatsDivsArr = [...countryStatsDivs.children];

  countryStatsDivsArr.map((child, index) => {
    const colors = Object.values(mainColors);
    const color = colors[index];
    child.style.borderBottom = `5px solid ${color}`;
    child.lastElementChild.style.background = color;
  });
}

// search countries based on search term
search.addEventListener('submit', (e) => {
  e.preventDefault();
  let term = e.target.children[0].value;
  term === '' ? alert('error') : searchCountries(term);
  search.reset();
  main.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
});

// invoke the search countries function in the country select with what the user selects
select.addEventListener('change', (e) => {
  searchCountries(e.target.value);
  main.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
  // select.selectedIndex = 0;
});

fetchData('historical/all', showChartHistory);
fetchData('all', updateUIWorldwideStats);

searchCountries();

listCountriesInSelect();
