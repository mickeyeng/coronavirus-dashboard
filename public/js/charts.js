import 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.bundle.min.js';
import { displayMap } from '../js/map.js';
const worldwideChart = document.querySelector('.myChart-worldwide');
let newCountryChart;
let ctx;

export function showChartHistory(history) {
  const ctx = worldwideChart.getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Object.keys(history.cases),
      datasets: [
        {
          label: 'Cases worldwide',
          backgroundColor: '#FF4136',
          borderColor: '#FF4136',
          data: Object.values(history.cases),
          fill: false,
        },
        {
          label: 'Deaths worldwide',
          backgroundColor: '#0074D9',
          borderColor: '#0074D9',
          data: Object.values(history.deaths),
          fill: false,
        },
        {
          label: 'Recoveries worldwide',
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
    },
  });
}

export function showChartHistoryByCountry(data) {
  const showVisualDiv = document.querySelector('#show-visual-wrapper');

  const dates = Object.keys(data.timeline.cases);
  const cases = Object.values(data.timeline.cases);
  const deaths = Object.values(data.timeline.deaths);
  const recovered = Object.values(data.timeline.recovered);
  console.log(recovered);

  const chartCanvas = document.createElement('canvas');
  chartCanvas.classList.add('myChart-country');
  showVisualDiv.appendChild(chartCanvas);

  const ctx = chartCanvas.getContext('2d');
  newCountryChart = new Chart(ctx, {
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
    },
  });

  toggleChartAndMap(data);
}

function toggleChartAndMap() {
  const toggleDiv = document.getElementById('toggle-map');
  const updateChart = document.getElementById('toggle-chart]');

  const map = document.querySelector('.map');
  const countryChart = document.querySelector('.myChart-country');

  console.log(map);

  toggleDiv.addEventListener('click', () => {
    countryChart.classList.toggle('active-chart');
    map.classList.toggle('active-map');

    countryChart.classList.contains('active-chart')
      ? (toggleDiv.textContent = 'Chart')
      : (toggleDiv.textContent = 'Map');
  });

  updateChart.addEventListener('click', () => {
    newCountryChart.type = 'line';
    newCountryChart.destroy();
    newCountryChart = new Chart(ctx, {
      type: 'line',
      data: ['mickey'],
    });
    // newCountryChart.update();
  });
}
