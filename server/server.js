const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const morgan = require('morgan');
const fetch = require('node-fetch');
require('dotenv').config();

const MAP_BOX_API_KEY = process.env.MAP_BOX_API_KEY;

app.use(morgan('common'));
app.use(express.json());

// Set static folder
app.use(express.static('public'));

app.get('/map', async (req, res) => {
  try {
    console.log('request made to map');
    // res.send('hello from server');
    const url = `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${MAP_BOX_API_KEY}`;

    const fetchData = await fetch(url);
    const data = await fetchData.json();
    return res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.send(error);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
