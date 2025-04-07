const PageHelpers = require("../Helpers/PageHelpers");
const userDao = require("../models/userModel.js");

exports.index = (req, res) => {
    PageHelpers.RenderView(res, 'index', {
        pageTitle: 'Welcome to the Dance Booking System',
        bundleName: 'index'
    });
};


exports.show_register_page = (req, res) => {
    PageHelpers.RenderView(res, 'anon/register', {
        pageTitle: 'Register',
        // bundleName: 'index'
    });
};

exports.post_new_user = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(401).send('Username and password are required');
        return;
    }

    const user = userDao.lookup(username);
    if (user) {
        res.status(400).send('User already exists');
    } else {
        userDao.create(username, password);
        console.log("register user", user, "password", password);
        res.redirect('/login');
    }
}

exports.show_login_page = (req, res) => {
    PageHelpers.RenderView(res, 'anon/login', {
        pageTitle: 'Login',
    });
};

exports.handle_login = (req, res) => {
   res.redirect('admin');
};

exports.admin_dashboard_page = (req, res) => {
    PageHelpers.RenderView(res, 'admin', {
        pageTitle: 'Dashboard',
    });
};