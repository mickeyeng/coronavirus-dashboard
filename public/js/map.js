export function displayMap(data) {
  const map = document.querySelector('.map');
  const { lat, long } = data.countryInfo;
  const { active, cases, country, deaths, todayDeaths } = data;

  map.innerHTML = `<div id="mapid"></div>`;

  console.log(lat, long);
  const mymap = L.map('mapid').setView([lat, long], 5);

  var OpenStreetMap_Mapnik = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxBoundsViscosity: 1.0,
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
  mymap.dragging.disable();
  mymap.touchZoom.disable();
  mymap.scrollWheelZoom.disable();
  if (map.classList.contains('active')) {
    mymap.invalidateSize();
    console.log('true');
  }
}
