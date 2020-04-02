export function displayMap(data) {
  // const mapDiv = document.createElement('div');
  // mapDiv.id = 'mapid';
  // map.appendChild(mapDiv);
  const map = document.querySelector('.map');

  console.log('map', data.countryInfo);

  const { lat, long } = data.countryInfo;
  const { active, cases, country, deaths, todayDeaths } = data;

  map.innerHTML = `<div id="mapid"></div>`;

  console.log('display-map working');
  console.log(lat, long);
  const mymap = L.map('mapid').setView([lat, long], 3);

  var OpenStreetMap_Mapnik = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
