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

    //validate qty
    const product = await Product.findOne({ where: { id: productId, status: "active" } })

    if(!product){
        return next(new AppError("Product doesn't exist", 404))
    }else if(quantity > product.quantity){
        return next(new AppError(`This product only has ${product.quantity} items available`, 400))
    }

    //Check if cart exists
    const cart = await Cart.findOne({
        where: { userId: sessionUser.id, status: "active" }
    })

    if(!cart){
        //create it
        const newCart = await Cart.create({ userId: sessionUser.id })

        //Add product then
        await ProductsInCart.create({ 
            cartId: newCart.id, 
            productId, 
            quantity 
        })
    }else{
        //already exists
        //check if product exists in cart yet
        const productExistInCart = await ProductsInCart.findOne({ where: { cartId: cart.id, productId }})

        if(productExistInCart){
            return next(new AppError("You've added this product to the cart", 400))
        }else if(productExistInCart && productExistInCart.status === "removed"){
            productExistInCart.update({ status: "active", quantity })
        }/* else if(!productExistInCart){
            
        } */

        await ProductsInCart.create({
            cartId: cart.id,
            productId,
            quantity
        })
    }

    res.status(200).json({
        status: "sucess",
        message: "Product added to cart"
    })

})

const updateCart = catchAsync( async( req, res, next ) => {
    const { sessionUser } = req
    const { productId, newQty } = req.body

    //get cart
    const cart = await Cart.findOne({
        where: { status: "active", userId: sessionUser.id } 
    })

    if(!cart){
        return next(new AppError("Don't have a cart", 400))
    }

    //Validate product in cart
    const productsInCart = await ProductsInCart.findOne({
        where: { status: "active", cartId: cart.id, productId },
        include: [{ model: Product }]
    })

    if(!productsInCart){
        return next(new AppError("Product hasn't been adeed to cart yet", 400))
    }

    //Validate the new qty is neither 0 or > than the stock
    if(newQty < 0 || newQty > productsInCart.product.quantity){
        return next(new AppError(`Can't add this quantity (${newQty}) of items`, 400))
    }

    //remove when = 0
    if(newQty === 0){
        await productsInCart.update({ quantity: 0, status: "removed" })
    }else if(newQty > 0){
        //update product qty
        await productsInCart.update({ quantity: newQty })
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

const purchaseCart = catchAsync( async( req, res, next ) => {
    const { sessionUser } = req
})

module.exports = { addProductToCart, updateCart, deleteProduct }