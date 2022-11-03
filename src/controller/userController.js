const User = require("../models/User");
const createToken = require("../../src/helper/token.helper");
const bcrypt = require("bcrypt");
const validator = require("validator");
const welcomeEmail = require("../service/WelcomeEmail");

const register = async (req, res) => {

    const { userName, email, password, isAdmin } = req.body;

    if (!userName && !email && !password) {
        throw Error("All fields must be filled")
    }

    if (!validator.isEmail(email)) {
        throw Error("Email not valid")
    }

    if (!validator.isStrongPassword(password)) {
        throw Error("Password strong enough")
    }

    const exists = await User.findOne({ email })
    if (exists) {
        throw Error('Email already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await User.create({ userName, email, password: hash, isAdmin })
    console.log(user)

    if(!user){
        throw Error('User not registered successfully...')
    }
    else{
        welcomeEmail(email, 'Dear Customer..Thanks for purchasing our products, hope you enjoy the shopping experience!!!')
    }

    const maxAge = 20 * 24 * 60 * 60;
    const token = createToken(user._id);
    res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
    res.status(201).json({ Message: 'Verification email sent successfully', user, token })
}

const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw Error("All fields must be filled")
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw Error('Incorrect email')
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error('Incorrect password')
    }

    const maxAge = 20 * 24 * 60 * 60;
    const token = createToken(user._id);
    res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
    res.status(200).json({email, token});
}

const logout = async (req, res) => {
    await res.cookie('jwt','',{maxAge: 1})
    // return res.redirect('/');
    res.status(200).json({Message: 'User logged out successfully!!!'})  
}

module.exports = {
    register,
    login,
    logout
}