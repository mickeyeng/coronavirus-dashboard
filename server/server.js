const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const fetch = require("node-fetch");
require("dotenv").config();

app.use(express.json());

app.use(express.static("public"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
