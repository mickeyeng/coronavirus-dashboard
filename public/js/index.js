import { displayMap } from './map.js';
import { showChartHistory, showChartHistoryByCountry } from './charts.js';
import {
  capitaliseFirstLetter,
  icons,
  mainColors,
  formatter,
  loader,
  selectObjKeys,
  appendNodeWithClass,
} from './util.js';

const WORLDWIDE_STATS = [
  'cases',
  'todayCases',
  'deaths',
  'todayDeaths',
  'recovered',
  'active',
  'tests',
];


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

const createCountryHeaderWrapper = () => {
  return appendNodeWithClass('div', 'country-info-header', searchCountryStats);
};

const createCountryInfoHeaderText = (country) => {
  const countryInfoHeader = document.querySelector('.country-info-header');
  appendNodeWithClass('h1', 'country-search-heading', countryInfoHeader);
  const countryInfoHeaderText = document.querySelector(
    '.country-search-heading'
  );
  countryInfoHeaderText.innerText = `Coronavirus in ${capitaliseFirstLetter(
    country
  )}`;
};

const createCountryInfoFlag = (countryImg) => {
  const countryInfoHeader = document.querySelector('.country-info-header');
  appendNodeWithClass('img', 'flag', countryInfoHeader);
  const countryImage = document.querySelector('.flag');
  countryImage.src = countryImg;
};

const createCountryHeader = (data, country) => {
  createCountryHeaderWrapper();
  createCountryInfoHeaderText(country);
  createCountryInfoFlag(data.countryInfo.flag);
};

const createMapAndChartButtons = () => {
  appendNodeWithClass('div', 'toggle', searchCountryStats, 'toggle-map', 'Map');
  const toggleChart = document.createElement('div');
  searchCountryStats.appendChild(toggleChart);
};

const createGraphAndMapWrapper = () => {
  appendNodeWithClass(
    'div',
    null,
    searchCountryStats,
    'show-visual-wrapper',
    null
  );
};

const createChartContainer = () => {
  const showVisualWrapper = document.getElementById('show-visual-wrapper');
  appendNodeWithClass('div', 'chart-container', showVisualWrapper, 'chart-container-country');
};

const createMapDiv = () => {
  const showVisualWrapper = document.getElementById('show-visual-wrapper');  
  appendNodeWithClass('div', 'map', showVisualWrapper);
  const map = document.querySelector('.map');
  map.classList.add('active', 'active-map');
};

const createCountryHistoryWrapper = () => {
  appendNodeWithClass('div', 'history-wrapper', searchCountryStats);
};

const createCountryHistoryDropdownText = () => {
  const historyWrapper = document.querySelector('.history-wrapper');
  appendNodeWithClass('div', 'history-wrapper__dropdown-text', historyWrapper, undefined, 'View History');
  const historyWrapperDropdown = document.querySelector('.history-wrapper__dropdown-text');
  historyWrapperDropdown.classList.remove('history-wrapper');
};

const createDropdownIcon = () => {
  const historyWrapperDropdown = document.querySelector('.history-wrapper__dropdown-text');
  appendNodeWithClass('i', 'dropdown-icon' , historyWrapperDropdown, 'dropdown')
  const dropdownIcon = document.querySelector('.dropdown-icon');
  dropdownIcon.classList.add('fas', 'fa-2x', 'fa-angle-double-down', 'dropdown-icon');
}

const createCountryStatWrapper = () => {
  appendNodeWithClass('div', 'country-stat-wrapper', searchCountryStats);
};





// const testData = {
//   updated: 1588729215153,
//   cases: 3726701,
//   todayCases: 2184,
//   deaths: 258295,
//   todayDeaths: 268,
//   recovered: 1241908,
//   active: 2226498,
//   critical: 49248,
//   casesPerOneMillion: 478,
//   deathsPerOneMillion: 33,
//   tests: 40360974,
//   testsPerOneMillion: 5176.8,
//   affectedCountries: 214,
// };

// const filterWorldwideStatsNew = () => {
//   return filterWorldwideStats(testData, WORLDWIDE_STATS  )
// }

// const filterWorldwideStatsOld = () => {
//   const filteredArrayCountry = Object.entries(testData).filter(([stat]) => {
//   return (
//     stat !== "updated" &&
//     stat !== "critical" &&
//     stat !== "casesPerOneMillion" &&
//     stat !== "deathsPerOneMillion" &&
//     stat !== "testsPerOneMillion" &&
//     stat !== "affectedCountries" 
//   );
// });
// return filteredArrayCountry
// }


const oldResult = JSON.stringify();
const newResult = JSON.stringify();

console.log(
  'test result: ' +
    (newResult === oldResult
      ? 'PASSED!'
      : 'FAILED! ' + '\n new: ' + newResult + '\n \n  old: ' + oldResult)
);



// update UI with data for specific country
function updateUISearchCountries(data, country) {
  if (data !== undefined) {
    searchCountryStats.innerHTML = ``;

    // ****** COUNTRY INFO HEADER ******
    createCountryHeader(data, country);

    // ****** TOGGLE CHART AND MAP ******
    createMapAndChartButtons();

    // ******  SHOW GRAPH AND MAP WRAPPER ******
    createGraphAndMapWrapper();

    // ******  CHART CONTAINER ******
    createChartContainer();

    // ******  MAP DIV ******
    createMapDiv();

    // ******  COUNTRY HISTORY WRAPPER ******
    createCountryHistoryWrapper();

    // ******  COUNTRY HISTORY DROPDOWN TEXT ******
    createCountryHistoryDropdownText();

    // ******  CREATE COUNTRY HISTORY DROPDOWN ICON ******
    createDropdownIcon();

    // ****** CREATE COUNTRY STAT WRAPPER ******
    createCountryStatWrapper();
      
    filterWorldwideStats(data, WORLDWIDE_STATS)

      

      







    //   filteredArrayCountry.forEach((info, index) => {
    //     const countryStatWrapper = document.querySelector('.country-stat-wrapper');
    //     const iconValues = Object.values(icons);
    //     const icon = iconValues[index];
    //     const countryStatTextBox = document.createElement('div');
    //     countryStatTextBox.classList.add('country-stat-text__box');
    //     countryStatWrapper.appendChild(countryStatTextBox);

    //     const countrySpan = document.createElement('span');
    //     countrySpan.textContent = formatter.format(info[1]);
    //     countryStatTextBox.textContent = `${capitaliseFirstLetter(info[0])} - `;
    //     countryStatTextBox.appendChild(countrySpan);

    //     const divStyle = document.createElement('div');
    //     divStyle.classList.add('country-stat-box-text__box-style');
    //     countryStatTextBox.appendChild(divStyle);
    //     const iconTag = document.createElement('i');
    //     iconTag.classList.add('fas', icon);
    //     iconTag.id = 'box-style__tag';
    //     divStyle.appendChild(iconTag);
    //   });
    // } else {
    //   console.log('error, country not found');
    // }

    // const countryStatsDivs = document.querySelector('.country-stats-wrapper');
    // const countryStatsDivsArr = [...countryStatsDivs.children];

    // countryStatsDivsArr.map((child, index) => {
    //   const colors = Object.values(mainColors);
    //   const color = colors[index];
    //   child.style.borderBottom = `5px solid ${color}`;
    //   child.lastElementChild.style.background = color;
    // });
  }
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
