//Models
const { Product } = require("../models/product.models")

//Utils
const { AppError } = require('../utils/appError.utils');
const { catchAsync } = require('../utils/catchAsync.utils');

const productExist = catchAsync( async( req, res, next )  => {
    const { id } = req.params

    const product = await Product.findOne({ where: { id } })

    if(!product){
        next(new AppError( "Product not found", 404 ))
    }
    req.product = product

    next()
})

module.exports = { productExist }