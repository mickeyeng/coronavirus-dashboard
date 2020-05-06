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
const main = document.querySelector('#main');
const API_BASE_URL = `https://disease.sh/v2`;

async function fetchData(url_path, callback, parentDiv) {
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
        loader(searchCases);
      }, 1000);
    }
  } catch (error) {
    throw ('Error fetching specific country data', error);
  }
}

function updateUIWorldwideCases(data) {
  const filteredArray = Object.entries(data).filter(
    (el, index) =>
      index !== 0 &&
      index !== 8 &&
      index !== 7 &&
      index !== 8 &&
      index !== 9 &&
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

// Search history by country and output to chart
async function searchHistoryChart(country) {
  try {
    const response = await fetch(`${API_BASE_URL}/historical/${country}`);
    if (response.status === 200) {
      const data = await response.json();
      const { deaths } = data.timeline;
      data.open = false;
      updateUISearchHistory(deaths, data);
      showChartHistoryByCountry(data);
    } else {
      loader(searchCases);
    }
  } catch (error) {
    throw ('Error fetching history data', error);
  }
}

// show data for country in the cases boxes
function updateUISearchHistory(deaths, data) {
  const dropdownIcon = document.getElementById('dropdown');
  const historyWrapper = document.querySelector('.history-wrapper');
  const deathsArr = Object.entries(deaths);

  deathsArr.map((ent) => {
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

// update UI with data for specific country
function updateUISearchCountries(data, country) {
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

    const toggleMap = document.createElement('div');
    toggleMap.classList.add('toggle');
    toggleMap.id = 'toggle-map';
    toggleMap.textContent = 'Map';
    searchCases.appendChild(toggleMap);
    searchCases.appendChild(toggleChart);

    const chartContainer = document.createElement('div');
    chartContainer.classList.add('chart-container');
    chartContainer.id = 'chart-container-country';

    const showGraphAndMapWrapper = document.createElement('div');
    showGraphAndMapWrapper.id = 'show-visual-wrapper';
    const mapDiv = document.createElement('div');
    mapDiv.classList.add('map', 'active', 'active-map');
    showGraphAndMapWrapper.appendChild(mapDiv);
    showGraphAndMapWrapper.appendChild(chartContainer);
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
    countryCaseText.classList.add('country-case-wrapper');
    searchCases.appendChild(countryCaseText);

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

  const countryCasesDivs = document.querySelector('.country-case-wrapper');
  const countryCasesDivsArr = [...countryCasesDivs.children];

  countryCasesDivsArr.map((child, index) => {
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
fetchData('all', updateUIWorldwideCases);

searchCountries();

listCountriesInSelect();
