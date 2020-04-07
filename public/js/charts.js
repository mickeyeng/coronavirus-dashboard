import 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.bundle.min.js';

export function showChart(history) {
  const ctx = document.getElementById('myChart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Object.keys(history.cases),
      datasets: [
        {
          label: 'Number of cases worldwide',
          backgroundColor: '#FF4136',
          borderColor: '#FF4136',
          data: Object.values(history.cases),
          fill: false,
        },
        {
          label: 'Number of deaths worldwide',
          backgroundColor: '#0074D9',
          borderColor: '#0074D9',
          data: Object.values(history.deaths),
          fill: false,
        },
        {
          label: 'Number of Recoveries worldwide',
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
