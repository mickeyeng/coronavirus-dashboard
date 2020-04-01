'use strict';

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

// Set static folder
app.use(express.static('public'));

app.get('/', (req, res) => res.render('hello from server'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
