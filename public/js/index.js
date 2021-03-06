/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/extensions */
import { displayMap } from "./map.js";
import { showChartHistory, showChartHistoryByCountry } from "./charts.js";
import {
  capitaliseFirstLetter,
  formatter,
  selectObjKeys,
  appendNodeWithClass,
  capitaliseFirstLetterAndAddSpace,
} from "./util.js";

const WORLDWIDE_STATS = [
  "cases",
  "todayCases",
  "deaths",
  "todayDeaths",
  "recovered",
  "active",
  "tests",
  "critical",
  "affectedCountries",
  "population",
];

const COUNTRY_STATS = [
  "cases",
  "todayCases",
  "deaths",
  "todayDeaths",
  "recovered",
  "active",
  "tests",
];

const WORLDWIDE_ICONS = [
  "fa-user-times",
  "fa-globe-europe",
  "fa-vial",
  "fa-notes-medical",
  "fa-heartbeat",
  "fa-heart",
  "fa-ambulance",
  "fa-procedures",
  "fa-user-friends",
  "fa-users",
];

const COUNTRY_ICONS = [
  "fa-users",
  "fa-user-friends",
  "fa-procedures",
  "fa-ambulance",
  "fa-heart",
  "fa-heartbeat",
  "fa-notes-medical",
  "fa-vial",
  "fa-globe-europe",
];

const MAIN_COLOURS_WORLDWIDE = [
  "#abf0e9",
  "#5f6caf",
  "#ff8364",
  "rgba(57, 0, 102, 0.43)",
  "#ea8c8c",
  "#d72525",
  "#00afaa",
  "#9bbce3",
  "lightsalmon",
  "#80b796",
];

const MAIN_COLOURS_COUNTRY = [
  "#80b796",
  "lightsalmon",
  "#9bbce3",
  "#00afaa",
  "#d72525",
  "#ea8c8c",
  "rgba(57, 0, 102, 0.43)",
];

const searchCountryInput = document.querySelector("[data-form]");
const worldwideStats = document.querySelector("[data-worldwide-stats]");
const searchCountryStats = document.querySelector("[data-search-stats]");
const select = document.querySelector("select");
const loading = document.querySelector("[data-loader]");
const countryStats = document.querySelector("#country-status");
const darkModeBtn = document.getElementById("dark-mode-btn");

const API_BASE_URL = `https://disease.sh/v2`;

const loader = (parent) => {
  const childDiv = document.createElement("div");
  childDiv.classList.add("loader");
  parent.appendChild(childDiv);
};

darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  darkModeBtn.classList.toggle("fa-moon");
  darkModeBtn.classList.toggle("fa-sun");
});

const fetchData = async (urlPath, callback) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${urlPath}`);
    if (response.status === 200) {
      const data = await response.json();
      callback(data);
    } else {
      setTimeout(() => {
        loader(loading);
      }, 1000);
    }
  } catch (error) {
    throw ("Error fetching all data", error);
  }
};

const createOptionsInSelect = (countries) => {
  for (const value of countries) {
    const option = document.createElement("option");
    option.text = value.country;
    select.add(option);
  }
};
const searchCountries = async (country = "uk") => {
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
    throw ("Error fetching specific country data", error);
  }
};

const filterWorldwideStats = (worldwideData) => {
  return selectObjKeys(worldwideData, WORLDWIDE_STATS);
};

const filterCountryStats = (countryData) => {
  return selectObjKeys(countryData, COUNTRY_STATS);
};

const createWorldwideStatBox = () => {
  const worldwideStatsBox = document.createElement("div");
  worldwideStats
    .insertAdjacentElement("afterbegin", worldwideStatsBox)
    .classList.add("worldwide-stats-box");
};

const createWorldwideStatIconWrapper = (parent, color) => {
  appendNodeWithClass("div", "icon-wrapper", parent);
  const iconWrapper = document.querySelector(".icon-wrapper");
  iconWrapper.style.background = color;
};

const createWorldwideStatIcon = (className) => {
  const iconWrapper = document.querySelector(".icon-wrapper");
  appendNodeWithClass("i", "icon", iconWrapper);
  const icon = document.querySelector(".icon");
  iconWrapper.appendChild(icon).classList.add("fas", className, "fa-2x");
};

const createWorldwideStatBoxIcon = (className, color) => {
  const worldwideStatsBox = document.querySelector(".worldwide-stats-box");
  createWorldwideStatIconWrapper(worldwideStatsBox, color);
  createWorldwideStatIcon(className);
};

const createWorldwideStatBoxInfo = (parent, statText) => {
  appendNodeWithClass(
    "h2",
    "worldwide-stats-box-heading",
    parent,
    "",
    capitaliseFirstLetterAndAddSpace(statText)
  );
};

const createWorldwideStatBoxNumber = (parent, statNumber) => {
  appendNodeWithClass(
    "h1",
    "worldwide-stats-box-number",
    parent,
    "",
    formatter.format(statNumber)
  );
};

const createWorldwideStatBoxText = (parent, statText, statNumber) => {
  createWorldwideStatBoxInfo(parent, statText);
  createWorldwideStatBoxNumber(parent, statNumber);
};

const createWorldwideStatBoxBottomBorder = (color) => {
  const worldwideStatsBox = document.querySelector(".worldwide-stats-box");
  const bottomDiv = document.createElement("div");
  bottomDiv.style.background = color;
  worldwideStatsBox
    .appendChild(bottomDiv)
    .classList.add("worldwide-stats-box__bottom-div");
};

const updateUIWorldwideStats = (data) => {
  // css afterbegin reverses the array
  const worldwideStats = filterWorldwideStats(data).reverse();
  worldwideStats.forEach(([key, value], index) => {
    const icon = WORLDWIDE_ICONS[index];
    const color = MAIN_COLOURS_WORLDWIDE[index];
    createWorldwideStatBox();
    const worldwideStatsBox = document.querySelector(".worldwide-stats-box");
    createWorldwideStatBoxIcon(icon, color);
    createWorldwideStatBoxText(worldwideStatsBox, key, value);
    createWorldwideStatBoxBottomBorder(color);
  });
};

// Search history by country and output to chart
const searchHistoryChart = async (country) => {
  try {
    const response = await fetch(`${API_BASE_URL}/historical/${country}`);
    if (response.status === 200) {
      const data = await response.json();
      const { deaths } = data.timeline;
      data.isOpen = false;
      updateUISearchCountryHistory(deaths, data);
      showChartHistoryByCountry(data);
    } else {
      loader(searchCountryStats);
    }
  } catch (error) {
    throw ("Error fetching history data", error);
  }
};

const toggleExpandedClassOnHistoryChildren = (parent, dropDownIcon) => {
  const historyStatBoxWrapper = document.querySelector(
    ".history-stat-box-wrapper"
  );
  const historyWrapperChildren = [...parent.children];
  historyWrapperChildren.forEach((child) =>
    child.classList.toggle("history-stat-box-wrapper_expanded")
  );

  if (
    historyStatBoxWrapper.classList.contains(
      "history-stat-box-wrapper_expanded"
    )
  ) {
    parent.style.maxHeight = "300px";
    parent.style.overflowY = "scroll";
    dropDownIcon.style.transform = "rotate(180deg)";
  } else {
    dropDownIcon.style.transform = "rotate(0)";
    parent.style.maxHeight = "70px";
    parent.style.overflow = "hidden";
  }
};

// show data for country in the stats boxes
const updateUISearchCountryHistory = (deaths, data) => {
  const historyStatBoxDropdownIcon = document.getElementById("dropdown");
  const historyWrapper = document.querySelector(".history-wrapper");
  const countryHistoryData = Object.entries(deaths);
  countryHistoryData.forEach(([date, death]) => {
    if (!data.isOpen) {
      const historyStatBoxWrapper = document.createElement("div");
      const historyStatBoxText = document.createElement("p");
      historyStatBoxText.textContent = `Date: ${date} - Deaths: ${formatter.format(
        death
      )}`;
      historyWrapper
        .appendChild(historyStatBoxWrapper)
        .classList.add("history-stat-box-wrapper");
      historyStatBoxWrapper
        .appendChild(historyStatBoxText)
        .classList.add("history-date-info-text");
    }
  });

  // show country history info on dropdown click
  historyStatBoxDropdownIcon &&
    historyWrapper.addEventListener("click", () => {
      toggleExpandedClassOnHistoryChildren(
        historyWrapper,
        historyStatBoxDropdownIcon
      );
    });
};

const createCountryHeaderWrapper = () => {
  return appendNodeWithClass("div", "country-info-header", searchCountryStats);
};

const createCountryInfoHeaderText = (country, parent) => {
  appendNodeWithClass("h1", "country-search-heading", parent);
  const countryInfoHeaderText = document.querySelector(
    ".country-search-heading"
  );
  countryInfoHeaderText.innerText = `Coronavirus in ${capitaliseFirstLetter(
    country
  )}`;
};

const createCountryInfoFlag = (countryImg, parent) => {
  appendNodeWithClass("img", "flag", parent);
  const countryImage = document.querySelector(".flag");
  countryImage.src = countryImg;
};

const createCountryHeader = (data, country) => {
  createCountryHeaderWrapper();
  const countryInfoHeader = document.querySelector(".country-info-header");
  createCountryInfoHeaderText(country, countryInfoHeader);
  createCountryInfoFlag(data.countryInfo.flag, countryInfoHeader);
};

const createMapAndChartButtons = () => {
  appendNodeWithClass("div", "toggle", searchCountryStats, "toggle-map", "Map");
  const toggleChart = document.createElement("div");
  searchCountryStats.appendChild(toggleChart);
};

const createGraphAndMapWrapper = () => {
  appendNodeWithClass(
    "div",
    null,
    searchCountryStats,
    "show-visual-wrapper",
    null
  );
};

const createChartContainer = () => {
  const showVisualWrapper = document.getElementById("show-visual-wrapper");
  appendNodeWithClass(
    "div",
    "chart-container",
    showVisualWrapper,
    "chart-container-country"
  );
};

const createMapDiv = () => {
  const showVisualWrapper = document.getElementById("show-visual-wrapper");
  appendNodeWithClass("div", "map", showVisualWrapper);
  const map = document
    .querySelector(".map")
    .classList.add("active", "active-map");
  return map;
};

const createCountryStatChartAndMap = () => {
  createMapAndChartButtons();
  createGraphAndMapWrapper();
  createChartContainer();
  createMapDiv();
};

const createCountryHistoryWrapper = () => {
  appendNodeWithClass("div", "history-wrapper", searchCountryStats);
};

const createCountryHistoryDropdownText = (parent) => {
  appendNodeWithClass(
    "div",
    "history-wrapper__dropdown-text",
    parent,
    undefined,
    "View History"
  );
  const historyWrapperDropdown = document
    .querySelector(".history-wrapper__dropdown-text")
    .classList.remove("history-wrapper");
  return historyWrapperDropdown;
};

const createDropdownIcon = () => {
  const historyWrapperDropdown = document.querySelector(
    ".history-wrapper__dropdown-text"
  );
  appendNodeWithClass("i", "dropdown-icon", historyWrapperDropdown, "dropdown");
  const dropdownIcon = document
    .querySelector(".dropdown-icon")
    .classList.add("fas", "fa-2x", "fa-angle-double-down", "dropdown-icon");
  return dropdownIcon;
};

const createCountryStatHistoryBox = () => {
  createCountryHistoryWrapper();
  const historyWrapper = document.querySelector(".history-wrapper");
  createCountryHistoryDropdownText(historyWrapper);
  createDropdownIcon();
};

const createCountryStatWrapper = () => {
  appendNodeWithClass("div", "country-stat-wrapper", searchCountryStats);
};

const createCountryStatBox = (parent) => {
  appendNodeWithClass("div", "country-stat-box", parent);
};

const createCountryStatText = ([stat], parent) => {
  return appendNodeWithClass(
    "h3",
    null,
    parent,
    undefined,
    `${capitaliseFirstLetterAndAddSpace(stat)} - `
  );
};

const createCountryStatNumber = ([, statResult], parent) => {
  return appendNodeWithClass(
    "span",
    undefined,
    parent,
    undefined,
    `${formatter.format(statResult)}`
  );
};

const createCountryStatBoxStyle = (parent) => {
  appendNodeWithClass("div", "country-stat-box__style", parent);
};

const createCountryStatBoxIcon = (iconClassName, parent) => {
  const countryStatBoxStyle = document.querySelector(
    ".country-stat-box__style"
  );
  return appendNodeWithClass("i", "fas", parent, "box-style_tag");
};

const createStatBoxes = (data, countryStatWrapper) => {
  filterCountryStats(data, COUNTRY_STATS).forEach((stat, index) => {
    const iconValues = COUNTRY_ICONS;
    const icon = iconValues[index];

    const countryStatBox = document.createElement("div");
    countryStatWrapper
      .appendChild(countryStatBox)
      .classList.add("country-stat-box");

    createCountryStatText(stat, countryStatBox);
    createCountryStatNumber(stat, countryStatBox);

    const countryStatBoxStyle = document.createElement("div");

    countryStatBox
      .appendChild(countryStatBoxStyle)
      .classList.add("country-stat-box__style");

    const iconTag = document.createElement("i");
    iconTag.id = "box-style__tag";
    countryStatBoxStyle.appendChild(iconTag).classList.add("fas", icon);

    const color = MAIN_COLOURS_COUNTRY[index];
    countryStatBox.style.borderBottom = `5px solid ${color}`;
    countryStatBox.lastElementChild.style.background = color;
  });
};

// update UI with data for specific country
const updateUISearchCountries = (data, country) => {
  if (data !== undefined) {
    // resets the searchCountryStat
    searchCountryStats.innerHTML = ``;
    createCountryHeader(data, country);
    createCountryStatChartAndMap();
    createCountryStatHistoryBox();
    createCountryStatWrapper();
    const countryStatWrapper = document.querySelector(".country-stat-wrapper");
    createStatBoxes(data, countryStatWrapper);
  } else {
    throw "error, country not found";
  }
};

// search countries based on search term
searchCountryInput.addEventListener("submit", (e) => {
  e.preventDefault();
  const term = e.target.children[0].value;
  term === "" ? alert("error") : searchCountries(term);
  searchCountryInput.reset();
  countryStats.scrollIntoView({
    behavior: "smooth",
    block: "end",
  });
});

// invoke the search countries function in the country select with what the user selects
select.addEventListener("change", (e) => {
  searchCountries(e.target.value);
  countryStats.scrollIntoView({
    behavior: "smooth",
    block: "end",
  });
  // select.selectedIndex = 0;
});

fetchData("historical/all", showChartHistory);
fetchData("all", updateUIWorldwideStats);
fetchData("countries", createOptionsInSelect);
searchCountries();
