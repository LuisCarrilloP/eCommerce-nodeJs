const { ref, uploadBytes, getDownloadURL } = require("firebase/storage")

//Models
const { Product } = require("../models/product.models")
const { Category } = require("../models/category.models")
const { ProductImgs } = require("../models/productImgs.models")

//Utils
const { AppError } = require("../utils/appError.utils")
const { catchAsync } = require("../utils/catchAsync.utils")
const { storage } = require("../utils/firebase.utils")


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
    
    if(req.files.length > 0){
        const filesPromises = req.files.map(async file => {
            const imgRef = ref(storage, `products/${Date.now()}_${file.originalname}`)
            const imgRes = await uploadBytes(imgRef, file.buffer)
    
            return await ProductImgs.create({ 
                productId: newProduct.id,
                imgUrl: imgRes.metadata.fullPath
            })
        })
    
        await Promise.all(filesPromises)
    }

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

    //Map async
    const productImgsPromises = product.productImgs.map(async productImg => {
        const imgRef = ref(storage, productImg.imgUrl)
        const imgFullPath = await getDownloadURL(imgRef)
        productImg.imgUrl = imgFullPath
    })

    const productImgsResolved = await Promise.all(productImgsPromises)

    /* const productId = await Product.findOne({
        where: { id: product.id },
        attributes: ["id", "title", "price", "status"]
    }) */

    res.status(200).json({
        status: "sucess",
        message: "Here you have your product",
        product
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