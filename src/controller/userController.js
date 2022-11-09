const express = require("express");
const router = express.Router();
const User = require("../models/User");
const createToken = require("../../src/helper/token.helper");
const bcrypt = require("bcrypt");
const welcomeEmail = require("../service/WelcomeEmail");
const { registerValidate, loginValidate } = require("../helper/validator.helper");
const { validationResult } = require("express-validator");

// user-register
router.post('/user-register', registerValidate(), async (req, res) => {

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.json({ errors: errors.array() })
    }

    const { userName, email, password, isAdmin } = req.body;

    const exists = await User.findOne({ email })
    if (exists) {
        throw Error('Email already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await User.create({ userName, email, password: hash, isAdmin })
    console.log(user)

    if (!user) {
        throw Error('User not registered successfully...')
    }
    else {
        welcomeEmail(email, 'Dear Customer..Thanks for purchasing our products, hope you enjoy the shopping experience!!!')
    }

    const maxAge = 20 * 24 * 60 * 60;
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(201).json({ Message: 'Verification email sent successfully', user, token })
})

// user-login
router.post('/', loginValidate(), async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.json({ errors: errors.array() })
    }

    const { email, password } = req.body;

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
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(200).json({ email, token });
})

// user-logout
router.post('/logout', async (req, res) => {
    await res.cookie('jwt', '', { maxAge: 1 })
    // return res.redirect('/');
    res.status(200).json({ Message: 'User logged out successfully!!!' })
})

module.exports = router;