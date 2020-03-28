const search = document.querySelector('[data-form]');
const allCases = document.querySelector('[data-all-cases');
const searchCases = document.querySelector('[data-search-cases');
// const numberOfDeaths = document.querySelector('[data-deaths');
const select = document.querySelector('select');

const API_URL = `https://corona.lmao.ninja`;
const API_BACKUP_URL = `https://coronavirus-19-api.herokuapp.com/all`;

search.addEventListener('submit', e => {
  e.preventDefault();
  const term = e.target.children[0].value;
  console.log(term);

  if (term === '') {
    alert('error');
  } else {
    searchCountries(term);
  }
});

async function mainData() {
  try {
    const response = await fetch(`${API_URL}/all`);
    const data = await response.json();
    console.log(data);
    updateDomCases(data);
  } catch (error) {
    console.log(error);
  }
}

async function listCountries(country, e) {
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
    console.log(error);
  }
}

async function searchCountries(country = 'uk') {
  try {
    const response = await fetch(`${API_URL}/countries/${country}`);
    const data = await response.json();
    console.log(data);
    updateDomSearchCountries(data, country);
    searchHistory(country);
  } catch (error) {
    console.log(error);
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

async function searchHistory(country) {
  const dropdownIcon = document.querySelector('[data-dropdown]');

  try {
    const response = await fetch(
      `https://corona.lmao.ninja/v2/historical/${country}`
    );
    const data = await response.json();
    const { deaths } = data.timeline;

    const historyWrapper = document.querySelector('.history-wrapper');

    data.open = false;

    console.log('before click', deaths);

    const entries = Object.entries(deaths);
    console.log('entries', entries);

    entries.map(ent => {
      const historyDivDate = document.createElement('div');
      // const historyDivDeath = document.createElement('div');
      if (!data.open) {
        historyWrapper
          .appendChild(historyDivDate)
          .classList.add('history-date');
        historyDivDate.textContent = ent[1];
        historyDivDate.innerHTML = `
          <div>Date: ${ent[0]} - Deaths: ${ent[1]}</div>
        `;
        // console.log('ent', ent[1]);
        // historyDivDate.textContent = ent;
        // console.log(historyDivDate);
      }
    });

    // for (let historyEl of historyArr) {
    //   const historyDiv = document.createElement('div');
    //   historyEl.open = !historyEl.open;
    //   if (historyEl.open) {
    //     historyWrapper.appendChild(historyDiv).classList.add('history-date');
    //     historyDiv.textContent = historyEl.name;
    //   }
    // }

    dropdownIcon.addEventListener('click', () => {
      const historyDate = document.querySelector('.history-date');
      const children = [...historyWrapper.children];

      // remove the active class on toggle icon
      // console.log('children', children);
      children.forEach(child => {
        let icon = children[0];
        if (child === icon) {
          return child.classList.remove('active');
        } else {
          return child.classList.toggle('history-date_expanded');
        }
      });

      // set the transition with max-height
      if (historyDate.classList.contains('history-date_expanded')) {
        historyWrapper.style.maxHeight = historyWrapper.scrollHeight + 'px';
        console.log('open');
      } else {
        historyWrapper.style.maxHeight = '50px';
        console.log('closed');
      }
    });
  } catch (error) {
    console.log(error);
  }
}

function updateDomSearchCountries(data, country) {
  if (data !== undefined) {
    searchCases.innerHTML = `
      <h1 class="country-search-heading">Coronavirus in ${country
        .charAt(0)
        .toUpperCase() + country.slice(1)}</h1>


        <div class="history-wrapper">
        <i class="fas fa-2x fa-angle-double-down dropdown-icon" data-dropdown></i>

            view history      
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
        data.active
      }</span></div>
    `;
  } else {
    console.log('error, country not found');
  }
}

select.addEventListener('change', e => {
  console.log(e.target.value);
  searchCountries(e.target.value);
});

mainData();
searchCountries((country = 'uk'));
listCountries();
