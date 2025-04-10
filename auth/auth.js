const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const PageHelpers = require("../Helpers/PageHelpers");

//#region Authenticate

const generateToken = (username) => {
    return jwt.sign({ username: username }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

const authenticateToken = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).redirect("/login");

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).redirect("/login");
        req.user = user;
        next();
    });
}

const isLoggedIn = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        next();
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            res.clearCookie("jwt")
            next();
            return;
        }
        else {
            return res.redirect("/admin/dashboard");
        }
    });
}

//#endregion


//#region Register

const registerUser = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    userModel.create(username, hashedPassword);
}

//#endregion


//#region Login

const handleUserLogin = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        PageHelpers.RenderView(res, req, 'anon/login', {
            pageTitle: 'Login',
            errorMessage: 'Username and password are required'
        });
        return;
    }

    const user = await isValidUser(username);
    if (!user) {
        PageHelpers.RenderView(res, req, 'anon/login', {
            pageTitle: 'Login',
            errorMessage: 'User not found'
        });
    } else {
        console.log("login user", user, "password", password);

        var hasValidLogin = await isValidLogin(password, user.password);
        if (hasValidLogin) {
            res.cookie("jwt", generateToken(user.username));
            next();
        }
        else {
            PageHelpers.RenderView(res, req, 'anon/login', {
                pageTitle: 'Login',
                errorMessage: 'Invalid username and/or password'
            });
        }
    }
}

const isValidUser = async (username) => {
    return userModel.lookup(username).then((user) => {
        return user != null ? user : null;
    }).catch((err) => {
        return null;
    });
}

const isValidLogin = async (password, passwordHash) => {
    const isValidPassword = await bcrypt.compare(password, passwordHash);
    return isValidPassword;
}

//#endregion

module.exports = { authenticateToken, isLoggedIn, isValidUser, registerUser, handleUserLogin };
