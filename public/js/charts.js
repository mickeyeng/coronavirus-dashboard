import 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.bundle.min.js';
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
      maintainAspectRatio: false,
    },
  });
}

export function showChartHistoryByCountry(data) {
  const chartContainerCountry = document.getElementById(
    'chart-container-country'
  );
  console.log(chartContainerCountry);
  const dates = Object.keys(data.timeline.cases);
  const cases = Object.values(data.timeline.cases);
  const deaths = Object.values(data.timeline.deaths);
  const recovered = Object.values(data.timeline.recovered);
  const chartCanvas = document.createElement('canvas');
  chartCanvas.classList.add('myChart-country');
  chartContainerCountry.appendChild(chartCanvas);

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
      maintainAspectRatio: false,
    },
  });

  toggleChartAndMap(data);
}

function toggleChartAndMap() {
  const toggleDiv = document.getElementById('toggle-map');
  const map = document.querySelector('.map');
  const countryChart = document.querySelector('.myChart-country');
  toggleDiv.addEventListener('click', () => {
    countryChart.classList.toggle('active-chart');
    map.classList.toggle('active-map');

    countryChart.classList.contains('active-chart')
      ? (toggleDiv.textContent = 'Chart')
      : (toggleDiv.textContent = 'Map');
  });
}
