exports.index = function (req, res) {
    res.render('index');
};

exports.test_request = function (req, res) {
    res.send('This is a test!');
};