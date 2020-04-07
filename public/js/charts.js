import 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.bundle.min.js';

export function showChartHistory(history) {
  const ctx = document.getElementById('myChart').getContext('2d');
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
    options: {},
  });
}

export function showChartHistoryByCountry(data) {
  const showVisualDiv = document.querySelector('#show-visual-wrapper');
  console.log(data);
  const dates = Object.keys(data.timeline.cases);
  const cases = Object.values(data.timeline.cases);
  const deaths = Object.values(data.timeline.deaths);
  const recovered = Object.values(data.timeline.recovered);

  const chartDiv = document.createElement('canvas');
  chartDiv.id = 'myChart';
  showVisualDiv.appendChild(chartDiv);

  const ctx = chartDiv.getContext('2d');
  console.log(ctx);
  const chart = new Chart(ctx, {
    type: 'bar',
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
    options: {},
  });

  toggleChartAndMap();
}

function toggleChartAndMap() {
  const toggleDiv = document.querySelector('#toggle-chart');
  const map = document.querySelector('.map');

  toggleDiv.addEventListener('click', () => {
    console.log('clicked');
    // map.children[0].remove();
  });
}
