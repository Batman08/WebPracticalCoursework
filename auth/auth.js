const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const PageHelpers = require("../Helpers/PageHelpers");

// Generate JWT Token
const generateToken = (username) => {
    return jwt.sign({ username: username }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

// Verify Token
const authenticateToken = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).redirect("/login");

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).redirect("/login");
        req.user = user;
        next();
    });
}

// Register User
const registerUser = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return userModel.create(username, hashedPassword);
}

//#region Login User

const handleUserLogin = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        PageHelpers.RenderView(res, 'anon/login', {
            pageTitle: 'Login',
            errorMessage: 'Username and password are required'
        });
        return;
    }

    const user = await IsValidUser(username);
    if (!user) {
        PageHelpers.RenderView(res, 'anon/login', {
            pageTitle: 'Login',
            errorMessage: 'User not found'
        });
    } else {
        console.log("login user", user, "password", password);

        var isValidLogin = await IsValidLogin(password, user.password);
        if (isValidLogin) {
            res.cookie("jwt", generateToken(user.username));
            next();
        }
        else {
            PageHelpers.RenderView(res, 'anon/login', {
                pageTitle: 'Login',
                errorMessage: 'Invalid username and/or password'
            });
        }
    }
}

const IsValidUser = async (username) => {
    return userModel.lookup(username).then((user) => {
        return user != null ? user : null;
    }).catch((err) => {
        return null;
    });
}

const IsValidLogin = async (password, passwordHash) => {
    const isValidPassword = await bcrypt.compare(password, passwordHash);
    return isValidPassword;
}

//#endregion

module.exports = { authenticateToken, registerUser, handleUserLogin };
