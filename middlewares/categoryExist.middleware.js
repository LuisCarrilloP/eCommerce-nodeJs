//Models
const { Category } = require("../models/category.models")

//Utils
const { AppError } = require('../utils/appError.utils');
const { catchAsync } = require('../utils/catchAsync.utils');

const categoryExist = catchAsync( async( req, res, next )  => {
    const { id } = req.params

    const category = await Category.findOne({ where: { id } })

    if(!category){
        next(new AppError( "Category not found", 404 ))
    }
    req.category = category

    next()
})

module.exports = { categoryExist }