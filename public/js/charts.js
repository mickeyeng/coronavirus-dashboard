import 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.bundle.min.js';
const worldwideChart = document.querySelector('.myChart-worldwide');
import { appendNodeWithClass, getObjValues } from './util.js';

export const showChartHistory = (history) => {
  const ctx = worldwideChart.getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: Object.keys(history.cases),
      datasets: [
        {
          label: 'Cases Worldwide',
          backgroundColor: '#FF4136',
          borderColor: '#FF4136',
          data: Object.values(history.cases),
          fill: false,
        },
        {
          label: 'Deaths Worldwide',
          backgroundColor: '#0074D9',
          borderColor: '#0074D9',
          data: Object.values(history.deaths),
          fill: false,
        },
        {
          label: 'Recoveries Worldwide',
          backgroundColor: '#3D9970',
          borderColor: '#3D9970',
          data: Object.values(history.recovered),
          fill: false,
        },
      ],
    },

    // Configuration options go here
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
};

export const showChartHistoryByCountry = (data) => {
  const chartContainerCountry = document.getElementById(
    'chart-container-country'
  );
  const dates = Object.keys(data.timeline.cases);
  const cases = getObjValues(data.timeline.cases);
  const deaths = Object.values(data.timeline.deaths);
  const recovered = Object.values(data.timeline.recovered);

  appendNodeWithClass('canvas', 'myChart-country', chartContainerCountry);
  const chartCanvas = document.querySelector('.myChart-country');

  const ctx = chartCanvas.getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {
          label: `Cases - ${data.country} `,
          backgroundColor: '#FF4136',
          borderColor: '#FF4136',
          data: cases,

          fill: false,
        },
        {
          label: `Deaths - ${data.country} `,
          backgroundColor: '#0074D9',
          borderColor: '#0074D9',
          data: deaths,
          fill: false,
        },
        {
          label: `Recovered - ${data.country} `,
          backgroundColor: '#3D9970',
          borderColor: '#3D9970',
          data: recovered,
          fill: false,
        },
      ],
    },

    // Configuration options go here
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  toggleChartAndMap(data);
};

const toggleButtonOnClick = () => {
  const map = document.querySelector('.map');
  const toggleButton = document.getElementById('toggle-map');
  const countryChart = document.getElementById('chart-container-country');

  toggleButton.addEventListener('click', () => {
    countryChart.classList.toggle('active-chart');
    map.classList.toggle('active-map');
    countryChart.classList.contains('active-chart')
      ? (toggleButton.textContent = 'Chart')
      : (toggleButton.textContent = 'Map');
  });
};

const toggleChartAndMap = () => {
  toggleButtonOnClick();
};
33;
