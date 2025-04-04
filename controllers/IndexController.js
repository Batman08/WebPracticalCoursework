const PageHelpers = require("../Helpers/PageHelpers");

exports.index = function (req, res) {
    PageHelpers.RenderView(res, 'index', {
        pageTitle: 'Welcome to the Dance Booking System',
        bundleName: 'index'
      });
};

exports.test_request = function (req, res) {
    res.send('This is a test!');
};