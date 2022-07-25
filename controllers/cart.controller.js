//Models
const { Cart } = require("../models/cart.models")
const { ProductsInCart } = require("../models/productsInCart.models")
const { Product } = require("../models/product.models")

//Utils
const { AppError } = require("../utils/appError.utils")
const { catchAsync } = require("../utils/catchAsync.utils")

const addProductToCart = catchAsync( async( req, res, next ) => {
    const { productId, quantity } = req.body
    const { sessionUser } = req

    const findCart = await Cart.findOne({
        where: { userId: sessionUser.id, status: "active" }
    })

    if(!findCart){
        const newCart = await Cart.create({
            userId: sessionUser.id
        })
        const selectedProduct = await Product.findOne({
            where: { id: productId }
        })
        if(selectedProduct.quantity < quantity){
            return next(new AppError("This product isn't available anymore", 404))
        }
        const cart = await ProductsInCart.create({
            productId,
            cartId: newCart.id
        })
    }else{
        const cart = await ProductsInCart.findOne({
            where: { cartId: findCart.id }
        })
        if(cart.productId === productId && cart.status === "active"){
            return next(new AppError("You have already added this product to your cart", 400))
        }else if(cart.productId === productId && cart.status === "removed"){
            await ProductsInCart.update({
                quantity,
                status: "active"
            })
        }
    }

    res.status(204).json({
        status: "sucess",
        message: "Product now in cart"
    })

})

const updateCart = catchAsync( async( req, res, next ) => {
    const { sessionUser } = req
    const { productId, newQty } = req.body

    const findCart = await Cart.findOne({
        where: { userId: sessionUser.id, status: "active" }
    })

    if(!findCart){
        return next(new AppError("This user doesn't have a cart yet", 404))
    }

    const findProdcutInCart = await ProductsInCart.findOne({
        where: { cartId: findCart.id, status: "active" }
    })

    if(!findProdcutInCart){
        return next(new AppError("Product hasn't been adeed to cart yet", 400))
    }

    const productQty = await Product.findOne({
        where: { id: productId}
    })

    if(productQty.quantity < newQty){
        return next(new AppError("Product is not available", 404))
    }

    if(newQty === 0){
        findProdcutInCart.status === "removed"
    }else{
        findProdcutInCart.quantity === newQty
        findProdcutInCart.status === "active"
    }

    res.status(201).json({
        status: "sucess"
    })
})

const deleteProduct = catchAsync( async( req, res, next ) => {
    const { productId } = req.params
    const { sessionUser } = req

    const findCart = await Cart.findOne({
        where: { userId: sessionUser.id, status: "active" }
    })

    if(!findCart){
        return next(new AppError("There's no cart", 404))
    }

    const findProdcutInCart = await ProductsInCart.findOne({
        where: { productId, status: "active", cartId: findCart.id }
    })

    if(!findProdcutInCart){
        return next(new AppError("Not product added in this cart", 404))
    }

    findProdcutInCart.status === "removed"
    findProdcutInCart.quantity === 0
})

module.exports = { addProductToCart, updateCart, deleteProduct }