const express = require('express');
const app = express();
const port = process.env.port || 3000;
const path = require('path');

// Set static folder
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => res.send('Hello World'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
