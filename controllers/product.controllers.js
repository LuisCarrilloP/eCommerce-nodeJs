//Models
const { Product } = require("../models/product.models")
const { Category } = require("../models/category.models")

//Utils
const { AppError } = require("../utils/appError.utils")
const { catchAsync } = require("../utils/catchAsync.utils")


const createProduct = catchAsync( async( req, res, next ) => {
    const { sessionUser } = req
    const { title, description, price, categoryId, quantity } = req.body


    const newProduct = await Product.create({
        title,
        description,
        price,
        categoryId,
        quantity,
        userId: sessionUser.dataValues.id
    })

    res.status(201).json({
        status: "sucess",
        newProduct
    })
})

const getAllProducts = catchAsync( async( req, res, next ) => {
    const products = await Product.findAll({ 
        where: { status: "active" },
        include: [ { model: Category, attributes: ["id", "name", "status"]}] } )

    res.status(200).json({
        status: "sucess",
        products
    })
})

const getProductById = catchAsync( async( req, res, next ) => {
    const { product } = req

    const productId = await Product.findOne({
        where: { id: product.id },
        attributes: ["id", "title", "price", "status"]
    })

    res.status(200).json({
        status: "sucess",
        message: "Here you have your product",
        productId
    })
})

const updateProduct = catchAsync( async( req, res, next ) => {
    const { product } = req
    const { title, description, price, quantity } = req.body

    const productU = await product.update({
        title,
        description,
        price,
        quantity
    })

    res.status(201).json({
        status: "sucess",
        message: "product has been updated",
        productU
    })
})

const deleteProduct = catchAsync( async( req, res, next ) => {
    const { product } = req

    const productD = await product.update({ status: "disabled" })
    
    res.status(201).json({
        status: "sucess",
        message: "Product deleted",
        productD
    })
})

const getAllCategories = catchAsync( async( req, res, next ) => {
    const categories = await Category.findAll({ where: { status: "active" } })

    res.status(200).json({
        status: "sucess",
        categories
    })
})

const createCategory = catchAsync( async( req, res, next ) => {
    const { name } = req.body

    const newCategory = await Category.create({
        name
    })

    res.status(201).json({
        status: "sucess",
        message: "New Category created",
        newCategory
    })
})

const updateCategoryName = catchAsync( async( req, res, next ) => {
    const { category } = req
    const { name } = req.body

    const categoryU = await category.update({
        name
    })

    res.status(201).json({
        status: "sucess",
        categoryU
    })

})


module.exports = { createProduct, createCategory, getAllProducts, getProductById, updateProduct, deleteProduct, getAllCategories, updateCategoryName }