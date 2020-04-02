const map = document.querySelector('.map');
const KEY =
  'pk.eyJ1IjoibWlja2V5ZW5nIiwiYSI6ImNqdHQ5dHlqMjB3dm80ZGw4MW93bXJ3bDEifQ.XygC53CVuF2M4onZPwvwmg';

export function displayMap({ lat, long }) {
  // const mapDiv = document.createElement('div');
  // mapDiv.id = 'mapid';
  // map.appendChild(mapDiv);

  map.innerHTML = `<div id="mapid"></div>`;

  console.log('display-map working');
  console.log(lat, long);
  const mymap = L.map('mapid').setView([lat, long], 5);

  L.tileLayer(
    `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${KEY}`,
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 16,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: KEY
    }
  ).addTo(mymap);
  var marker = L.marker([lat, long]).addTo(mymap);
}
