import { displayMap } from './map.js';
import { showChartHistory, showChartHistoryByCountry } from './charts.js';
import { capitaliseFirstLetter, formatter, selectObjKeys, appendNodeWithClass, } from './util.js';

const WORLDWIDE_STATS = [
  'cases',
  'todayCases',
  'deaths',
  'todayDeaths',
  'recovered',
  'active',
  'tests',
];

const ICONS = [
  'fa-users',
  'fa-user-friends',
  'fa-procedures',
  'fa-ambulance',
  'fa-heart',
  'fa-heartbeat',
  'fa-notes-medical',
  'fa-vial',
  'fa-globe-europe',
];

const MAIN_COLOURS = [
  '#80b796',
  'lightsalmon',
  '#9bbce3',
  '#00afaa',
  '#d72525',
  '#ea8c8c',
  'rgba(57, 0, 102, 0.43)',
];


const search = document.querySelector('[data-form]');
const worldwideStats = document.querySelector('[data-worldwide-stats]');
const searchCountryStats = document.querySelector('[data-search-stats]');
const select = document.querySelector('select');
const loading = document.querySelector('[data-loader]');
const main = document.querySelector('#main');
const darkModeBtn = document.getElementById('dark-mode-btn');

const API_BASE_URL = `https://disease.sh/v2`;

function loader(parent) {
  const childDiv = document.createElement('div');
  childDiv.classList.add('loader');
  parent.appendChild(childDiv);
}

darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  darkModeBtn.classList.toggle('fa-moon');
  darkModeBtn.classList.toggle('fa-sun');
});

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

const createOptionsInSelect = (countries) => {
  for (let value of countries) {
    const option = document.createElement('option');
    option.text = value.country;
    select.add(option);
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

const createWorldwideStatBox = () => {
  const worldwideStatsBox = document.createElement('div');
  worldwideStatsBox.classList.add('worldwide-stats-box');
  worldwideStats.insertAdjacentElement('afterbegin', worldwideStatsBox);
}


const createWorldwideStatIconWrapper = (parent, color) => {
  appendNodeWithClass('div', 'icon-wrapper', parent);
  const iconWrapper = document.querySelector('.icon-wrapper')
  iconWrapper.style.background = color;
}

const createWorldwideStatIcon = (className) => {
  const iconWrapper = document.querySelector('.icon-wrapper');
  appendNodeWithClass('i', 'icon', iconWrapper)
  const icon = document.querySelector('.icon');
  icon.classList.add('fas', className, 'fa-2x');
  iconWrapper.appendChild(icon);
}

function createWorldwideStatBoxIcon(className, color) {
  const worldwideStatsBox = document.querySelector('.worldwide-stats-box');
  createWorldwideStatIconWrapper(worldwideStatsBox, color);
  createWorldwideStatIcon(className);
}

const createWorldwideStatBoxInfo = (parent, statText) => {
  appendNodeWithClass('h2', 'worldwide-stats-box-heading', parent, '', capitaliseFirstLetter(statText));
}

const createWorldwideStatBoxNumber = (parent, statNumber) => {
appendNodeWithClass('h1', 'worldwide-stats-box-number', parent, '', formatter.format(statNumber));
}

const createWorldwideStatBoxText = (parent, statText, statNumber) => {
  createWorldwideStatBoxInfo(parent, statText);
  createWorldwideStatBoxNumber(parent, statNumber);
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
    const icon = ICONS[index];
    const color = MAIN_COLOURS[index];
    createWorldwideStatBox();
    const worldwideStatsBox = document.querySelector('.worldwide-stats-box');
    createWorldwideStatBoxIcon(icon, color);
    createWorldwideStatBoxText(worldwideStatsBox, key, value);
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

const createCountryInfoHeaderText = (country, parent) => {
  appendNodeWithClass('h1', 'country-search-heading', parent);
  const countryInfoHeaderText = document.querySelector(
    '.country-search-heading'
  );
  countryInfoHeaderText.innerText = `Coronavirus in ${capitaliseFirstLetter(
    country
  )}`;
};

const createCountryInfoFlag = (countryImg, parent) => {
  appendNodeWithClass('img', 'flag', parent);
  const countryImage = document.querySelector('.flag');
  countryImage.src = countryImg;
};

const createCountryHeader = (data, country) => {
  createCountryHeaderWrapper();
  const countryInfoHeader = document.querySelector('.country-info-header');
  createCountryInfoHeaderText(country, countryInfoHeader);
  createCountryInfoFlag(data.countryInfo.flag, countryInfoHeader);
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


const createCountryStatChartAndMap = () => {
  createMapAndChartButtons();
  createGraphAndMapWrapper();
  createChartContainer();
  createMapDiv();
}

const createCountryHistoryWrapper = () => {
  appendNodeWithClass('div', 'history-wrapper', searchCountryStats);
};

const createCountryHistoryDropdownText = (parent) => {
  appendNodeWithClass('div', 'history-wrapper__dropdown-text', parent, undefined, 'View History');
  const historyWrapperDropdown = document.querySelector('.history-wrapper__dropdown-text');
  historyWrapperDropdown.classList.remove('history-wrapper');
};

const createDropdownIcon = () => {
  const historyWrapperDropdown = document.querySelector('.history-wrapper__dropdown-text');
  appendNodeWithClass('i', 'dropdown-icon' , historyWrapperDropdown, 'dropdown')
  const dropdownIcon = document.querySelector('.dropdown-icon');
  dropdownIcon.classList.add('fas', 'fa-2x', 'fa-angle-double-down', 'dropdown-icon');
}

const createCountryStatHistoryBox = () => {
  createCountryHistoryWrapper();
  const historyWrapper = document.querySelector('.history-wrapper');
  createCountryHistoryDropdownText(historyWrapper);
  createDropdownIcon();
}

const createCountryStatWrapper = () => {
  appendNodeWithClass('div', 'country-stat-wrapper', searchCountryStats);
};


const createCountryStatBox = (parent) => {
  appendNodeWithClass('div', 'country-stat-box', parent);
}

const createCountryStatText = (stat, parent) => {
  // const countryStatBox = document.querySelector('.country-stat-box');
  return appendNodeWithClass('h3', null, parent, undefined, `${capitaliseFirstLetter(stat[0])} -`);
}

const createCountryStatNumber = (stat, parent) => {
  return appendNodeWithClass('span', undefined, parent, undefined, formatter.format(stat[1]))
}

const createCountryStatBoxStyle = (parent) => {
  appendNodeWithClass('div', 'country-stat-box__style', parent);
} 

const createCountryStatBoxIcon = (iconClassName, parent) => {
  const countryStatBoxStyle = document.querySelector('.country-stat-box__style')
  return appendNodeWithClass('i', 'fas', parent, 'box-style_tag')
  // const icon = document.getElementById('box-style_tag');
  // icon.classList.add(iconClassName);
  // return icon
}


const createStatBoxes = (data, countryStatWrapper) => {
  filterWorldwideStats(data, WORLDWIDE_STATS).forEach((stat, index) => {
      const iconValues = ICONS
      const icon = iconValues[index];

      const countryStatBox = document.createElement('div');
      countryStatBox.classList.add('country-stat-box');
      countryStatWrapper.appendChild(countryStatBox);

      createCountryStatText(stat, countryStatBox);
      createCountryStatNumber(stat, countryStatBox);

      const countryStatBoxStyle = document.createElement('div')
      countryStatBoxStyle.classList.add('country-stat-box__style');
      countryStatBox.appendChild(countryStatBoxStyle);

      const iconTag = document.createElement('i');
      iconTag.classList.add('fas', icon)
      iconTag.id = 'box-style__tag';
      countryStatBoxStyle.appendChild(iconTag);

      const color = MAIN_COLOURS[index];
      countryStatBox.style.borderBottom = `5px solid ${color}`;
      countryStatBox.lastElementChild.style.background = color;

  })
}

// const createCountryStatBox = (stat, iconClassName, parent) => {
//   createCountryStatTextBox(countryStatWrapper);
//   createCountryStatText(stat, parent);
//   createCountryStatNumber(stat);
//   createCountryStatBoxStyle();
//   createCountryStatBoxIcon(iconClassName)
// }

// update UI with data for specific country
function updateUISearchCountries(data, country) {  
  if (data !== undefined) {
    // resets the searchCountryStat
    searchCountryStats.innerHTML = ``;

    createCountryHeader(data, country);
    createCountryStatChartAndMap();
    createCountryStatHistoryBox();
    createCountryStatWrapper();
    const countryStatWrapper = document.querySelector('.country-stat-wrapper');
    createStatBoxes(data, countryStatWrapper);
  } else {
      console.log('error, country not found');
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
// LIST COUNTRIES IN THE SELECT
fetchData('countries', createOptionsInSelect)
searchCountries();

