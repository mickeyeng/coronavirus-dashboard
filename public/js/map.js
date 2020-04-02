const map = document.querySelector('.map');
const KEY =
  'pk.eyJ1IjoibWlja2V5ZW5nIiwiYSI6ImNqdHQ5dHlqMjB3dm80ZGw4MW93bXJ3bDEifQ.XygC53CVuF2M4onZPwvwmg';

export function displayMap(data) {
  // const mapDiv = document.createElement('div');
  // mapDiv.id = 'mapid';
  // map.appendChild(mapDiv);

  console.log('map', data.countryInfo);

  const { lat, long } = data.countryInfo;
  const { active, cases, country, deaths, todayDeaths } = data;

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
  const marker = L.marker([lat, long]).addTo(mymap);
  const countryDetails = `
  <h4>${country}</h4>
  <br />
  <ul>
    <li>Active cases: <strong>${active}</strong></li>
    <li>Total Cases:<strong>${cases}</strong></li>
    <li>Deaths: <strong>${deaths}</strong></li>
    <li>Today's Deaths: <strong>${todayDeaths}</strong></li>
  </ul>
  `;

  marker.bindPopup(countryDetails).openPopup();
}
