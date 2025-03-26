const express = require("express");
const app = express();

const path = require('path');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './public')));

const mustache = require('mustache-express');
app.engine('mustache', mustache());
app.set('view engine', 'mustache');

const router = require('./routes/IndexRoutes');

app.use('/', router);
app.listen(3000, () => {
    console.log('Server listening on port: 3000');
});