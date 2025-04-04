const express = require("express");
const path = require('path');
const mustache = require('mustache-express');
const cookieParser = require('cookie-parser')


const app = express();
require('dotenv').config() //load data from .env file
app.use(cookieParser())

Helpers_SetupMustache();

Helpers_ParsingMiddleware();
Helpers_ServeStaticFiles();

const router = require('./routes/IndexRoutes');
app.use('/', router);
app.listen(3000, () => {
    console.log('Server listening on port: 3000');
});


//#region Helpers

function Helpers_SetupMustache() {
    // Set up mustache for templating
    app.engine('mustache', mustache());
    app.set('view engine', 'mustache');
}

function Helpers_ParsingMiddleware() {
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
}

function Helpers_ServeStaticFiles() {
    app.use(express.static(path.join(__dirname, "node_modules")));
    app.use(express.static(path.join(__dirname, "public")));
}

//#endregion