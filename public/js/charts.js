// import Chart from '../../node_modules/chart.js/dist/Chart.min.js';
import 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.bundle.min.js';

export function showChart(history) {
  var ctx = document.getElementById('myChart').getContext('2d');
  console.log('history', history);
  // console.log('cases', cases);

  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
      labels: Object.keys(history.cases),
      datasets: [
        {
          label: 'Number of cases worldwide',
          backgroundColor: '#FF4136',
          borderColor: '#FF4136',
          // data: Object.values(all.cases),
          data: Object.values(history.cases),
          fill: false,
        },
        {
          label: 'Number of deaths worldwide',
          backgroundColor: '#0074D9',
          borderColor: '#0074D9',
          // data: Object.values(all.cases),
          data: Object.values(history.deaths),
          fill: false,
        },
        {
          label: 'Number of Recoveries worldwide',
          backgroundColor: '#3D9970',
          borderColor: '#3D9970',
          // data: Object.values(all.cases),
          data: Object.values(history.recovered),
          fill: false,
        },

        // {
        //   label: 'Number of deaths worldwide',
        //   backgroundColor: 'rgb(255, 99, 130)',
        //   borderColor: 'rgb(255, 99, 132)',
        //   // data: [0, 10, 5, 2, 20, 30, 45],
        //   data: [deaths]
        // },

        // {
        //   label: 'Number of active cases worldwide',
        //   backgroundColor: 'rgb(255, 99, 131)',
        //   borderColor: 'rgb(255, 99, 132)',
        //   // data: [0, 10, 5, 2, 20, 30, 45],
        //   data: [active]
        // },
        // {
        //   label: 'Number of recoveries worldwide',
        //   backgroundColor: 'rgb(255, 99, 134)',
        //   borderColor: 'rgb(255, 99, 132)',
        //   // data: [0, 10, 5, 2, 20, 30, 45],
        //   data: [recovered]
        // }
      ],
    },

    // Configuration options go here
    options: {},
  });
}
