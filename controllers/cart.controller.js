//Models
const { Cart } = require("../models/cart.models")

//Utils
const { AppError } = require("../utils/appError.utils")
const { catchAsync } = require("../utils/catchAsync.utils")

const addProductToCart = catchAsync( async( req, res, next ) => {
    const { productId, quantity } = req.body

})

module.exports = { addProductToCart }