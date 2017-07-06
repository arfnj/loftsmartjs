/*jshint esversion: 6*/

// SETUP
const express = require('express');
const port = process.env.PORT || 2222;
const app = express();

app.listen(port, function() {
  console.log(`listening on port: ${port}`);
});

// server static files in public
app.use(express.static(path.join(__dirname, '../public')));

// Hook up routes
require('./routes.js')(app, express);
