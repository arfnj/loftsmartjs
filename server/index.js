/*jshint esversion: 6*/

// SETUP
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.PORT || 2222;
const app = express();

app.listen(port, function() {
  console.log(`listening on port: ${port}`);
});

// middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Hook up routes
require('./routes.js')(app, express);
