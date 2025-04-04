const express = require("express");
const app = express();
const path = require('path');
const mustache = require('mustache-express');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './public')));

// Generic function to serve all static files from the "public" directory
app.use(express.static(path.join(__dirname, "node_modules")));
app.use(express.static(path.join(__dirname, "public")));

// Set up mustache for templating
app.engine('mustache', mustache());
app.set('view engine', 'mustache');

const router = require('./routes/IndexRoutes');
app.use('/', router);
app.listen(3000, () => {
    console.log('Server listening on port: 3000');
});