const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

// Generate JWT Token
const generateToken = (username) => {
    return jwt.sign({ username: username }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

// Verify Token
const authenticateToken = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).redirect("/anon/login");

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send("Invalid Token");
        req.user = user;
        next();
    });
}

// Register User
const registerUser = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return userModel.create(username, hashedPassword);
}

// Login User
const loginUser = async (username, password) => {
    const user = await userModel.lookup(username);
    if (!user) return null;

    const isValidPassword = await bcrypt.compare(password, user.password);
    return isValidPassword ? res.cookie("jwt", generateToken(user.username)): res.render("anon/login");
}

module.exports = { authenticateToken, registerUser, loginUser };
