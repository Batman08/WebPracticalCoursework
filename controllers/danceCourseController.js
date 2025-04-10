const PageHelpers = require("../Helpers/PageHelpers");
const auth = require('../auth/auth.js')

exports.index = (req, res) => {
    PageHelpers.RenderView(res, req, 'index', {
        pageTitle: 'Welcome to the Dance Booking System',
        bundleName: 'index'
    });
};


exports.show_register_page = (req, res) => {
    PageHelpers.RenderView(res, req, 'anon/register', {
        pageTitle: 'Register'
    });
};

exports.post_new_user = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(401).send('Username and password are required');
        return;
    }

    const user = await auth.isValidUser(username);
    if(!user){
        auth.registerUser(username, password);
        res.redirect('/login');

        /* ToDo: log user in straight away? */
    }
    else{
        console.log("test!!!!!!!!!!!!");
        PageHelpers.RenderView(res, req, 'anon/register', {
            pageTitle: 'Register',
            errorMessage: 'User already exists'
        });        
    }
}


exports.show_login_page = (req, res) => {
    PageHelpers.RenderView(res, req, 'anon/login', {
        pageTitle: 'Login',
    });
};

exports.handle_login = (req, res) => {
    res.redirect('admin/dashboard');
};

exports.handle_logout = (req, res) => {
    req.user = null;
    res.clearCookie("jwt").status(200).redirect("/");
};


exports.dashboard_page = (req, res) => {
    PageHelpers.RenderView(res, req, 'admin/dashboard', {
        pageTitle: 'Dashboard',
    });
};