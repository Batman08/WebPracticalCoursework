const PageHelpers = require("../Helpers/PageHelpers");
const userDao = require("../models/userModel.js");

exports.index = (req, res) => {
    PageHelpers.RenderView(res, req, 'index', {
        pageTitle: 'Welcome to the Dance Booking System',
        bundleName: 'index'
    });
};


exports.show_register_page = (req, res) => {
    PageHelpers.RenderView(res, req, 'anon/register', {
        pageTitle: 'Register',
        // bundleName: 'index'
    });
};

exports.post_new_user = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(401).send('Username and password are required');
        return;
    }

    const user = userDao.lookup(username).then((user) => {
        if (user) {
            PageHelpers.RenderView(res, req, 'anon/register', {
                pageTitle: 'Register',
                errorMessage: 'User already exists'
            });
        }
    }).catch((err) => {
        /* ToDo: might change how lookup function works */

        //user not found in database, so create new user
        userDao.create(username, password);
        console.log("register user", user, "password", password);
        res.redirect('/login');

        /* ToDo: log user in straight away? */
    });
}

exports.show_login_page = (req, res) => {
    PageHelpers.RenderView(res, req, 'anon/login', {
        pageTitle: 'Login',
    });
};

exports.handle_login = (req, res) => {
    res.redirect('admin');
};

exports.handle_logout = (req, res) => {
    req.user = null;
    res.clearCookie("jwt").status(200).redirect("/");
};

exports.admin_dashboard_page = (req, res) => {
    PageHelpers.RenderView(res, req, 'admin', {
        pageTitle: 'Dashboard',
    });
};