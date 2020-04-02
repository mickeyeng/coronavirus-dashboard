export function displayMap({ lat, long }) {
  console.log('display-map working');
  console.log(lat, long);
  const mymap = L.map('mapid').setView([51.505, -0.09], 13);
  L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        'pk.eyJ1IjoibWlja2V5ZW5nIiwiYSI6ImNrOGhsZDBucTAxbmQzbW1nM25pd3R1Ym8ifQ.gLQNi75K0Od_Li8bkJso0w'
    }
  ).addTo(mymap);

  var marker = L.marker([51.5, -0.09]).addTo(mymap);
}
