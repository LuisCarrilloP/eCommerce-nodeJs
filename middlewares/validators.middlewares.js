const { body, validationResult } = require("express-validator")

//Utils
const { AppError } = require("../utils/appError.utils")

const checkResult = (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        const errorMsgs = errors.array().map(err => err.msg)
        const message = errorMsgs.join(". ")
        return next(new AppError(message, 400))
    }

    next()
} 

const createUserValidators = [
	body('name')
		.notEmpty().withMessage('Name cannot be empty'),
	body('email')
		.isEmail().withMessage('Must provide a valid email'),
	body('password')
		.isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
		.isAlphanumeric().withMessage('Password must contain letters and numbers'),
	checkResult,
];

const createProductValidators = [
	body("title")
		.notEmpty().withMessage("What's the product name?"),
	body("description")
		.notEmpty().withMessage("Tell me more about this product"),
	body("price")
		.notEmpty().withMessage("How much it costs?")
		.isNumeric().withMessage("Price only allows numbers"),
	body("categoryId")
		.notEmpty().withMessage("Link it with a category")
		.isNumeric().withMessage("Link it with a number"),
	body("quantity")
		.notEmpty().withMessage("How many?"),
	checkResult
]

module.exports = { createUserValidators, createProductValidators }