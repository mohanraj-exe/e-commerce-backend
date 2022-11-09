// const User = require("../models/User");
const { body, param } = require('express-validator');

// Validation Array
const registerValidate = () => {
    return [
        body('userName').trim().not().isEmpty().isString().withMessage('Please enter only letters').isLength({ min: 3, max: 5 }),
        body('email').trim().not().isEmpty().withMessage('This field is required')
            .isEmail().trim().withMessage('Please enter a valid email address'),
        body('password').isLength({ min: 8 }).withMessage('Password Must Be at Least 8 Characters')
            .matches('[0-9]').withMessage('Password Must Contain a Number')
            .matches('[A-Z]').withMessage('Password Must Contain an Uppercase Letter').trim().escape()
    ]
}

const loginValidate = () => {
    return [
        body('email').trim().not().isEmpty().withMessage('This field is required'),
        body('password').isLength({ min: 8 }).withMessage('Password Must Be at Least 8 Characters')
    ]
}

const categoriesValidate = () => {
    return [
        body('categoryName').trim().not().isEmpty().withMessage('This field is required'),
        body('categoryDesc').trim().not().isEmpty().withMessage('This field is required')
            .isLength({ min: 50, max: 250 }).withMessage('Category Description Must not be at greater than 250 Characters')
    ]
}

const categoriesUpdateValidate = () => {
    return [
        body('categoryName').trim().not().isEmpty().withMessage('This field is required'),
        param('id').trim().not().isEmpty().withMessage('This field is required').isLength({ min: 24 })
        .withMessage('Input Id is not valid')
    ]
}

const productsValidate = () => {
    return [
        body('productName').trim().not().isEmpty().withMessage('This field is required'),
        body('productDesc').trim().not().isEmpty().withMessage('This field is required'),
        body('productCost').trim().not().isEmpty().withMessage('This field is required').isInt().withMessage('Must be a integer number'),
        body('productQuantity').trim().not().isEmpty().withMessage('This field is required').isInt().withMessage('Must be a integer number'),
        body('productStatus').trim().not().isEmpty().withMessage('This field is required').isBoolean().withMessage('It should be launched or not launched'),
        body('categoryId').trim().not().isEmpty().withMessage('This field is required'),
        body('categoryName').trim().not().isEmpty().withMessage('This field is required'),
    ]
}

const productsUpdateValidate = () => {
    return [
        body('categoryName').trim().not().isEmpty().withMessage('This field is required'),
        param('id').trim().not().isEmpty().withMessage('This field is required').isLength({ min: 24 })
        .withMessage('Input Id is not valid')
    ]
}

const cartValidate = () => {
    return [
        body('cartItems').not().isEmpty().withMessage('This field is required'),
        body('userId').trim().not().isEmpty().withMessage('This field is required'),
        body('userName').trim().not().isEmpty().withMessage('This field is required'),
        body('email').trim().not().isEmpty().withMessage('This field is required')
    ]
}

module.exports = { registerValidate, 
    loginValidate, 
    categoriesValidate, 
    categoriesUpdateValidate, 
    productsValidate, 
    productsUpdateValidate,
    cartValidate
}