const express = require('express');
const controller = require('../controllers/IndexController.js');
const router = express.Router();

router.get("/", controller.index);
router.get('/test_request', controller.test_request);

router.use(function (req, res) {
    res.status(404);
    res.type('text/plain');
    res.send('404 Not found.');
});

router.use(function (err, req, res, next) {
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error.');
});

module.exports = router;