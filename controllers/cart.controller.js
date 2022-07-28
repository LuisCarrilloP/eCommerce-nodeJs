//Models
const { Cart } = require("../models/cart.models")
const { ProductsInCart } = require("../models/productsInCart.models")
const { Product } = require("../models/product.models")
const { Order } = require("../models/order.models")
const { User } = require("../models/user.models")

//Utils
const { AppError } = require("../utils/appError.utils")
const { catchAsync } = require("../utils/catchAsync.utils")
const { Email } = require("../utils/email.utils")


const getUserCart = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
  
    const cart = await Cart.findOne({
      where: { userId: sessionUser.id, status: 'active' },
      attributes: ["id", "userId"],
      include: [
        {
          model: ProductsInCart,
          attributes: ["id", "cartId", "productId", "quantity"],
          required: false,
          where: { status: 'active' },
          include: { model: Product, attributes: ["id", "title", "price" ] },
        },
      ],
    });
  
    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }
  
    res.status(200).json({ status: 'success', cart });
});

const addProductToCart = catchAsync( async( req, res, next ) => {
    const { sessionUser } = req
    const { productId, quantity } = req.body

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

const updateProductInCart = catchAsync( async( req, res, next ) => {
    const { sessionUser } = req
    const { productId, newQty } = req.body

    //validate qty
    const product = await Product.findOne({ 
        where: { id: productId, status: "active" } 
    })

    if(!product){
        return next(new AppError("Product doesn't exist", 404))
    }else if(newQty > product.quantity){
        return next(new AppError(`This product only has ${product.quantity} items available`, 400))
    }

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
    /* if(newQty < 0 || newQty > productsInCart.product.quantity){
        return next(new AppError(`Can't add this quantity (${newQty}) of items`, 400))
    } */

    //remove when = 0
    if(newQty <= 0){
        await productsInCart.update({ quantity: 0, status: "removed" })
    }else if(newQty > 0){
        //update product qty
        await productsInCart.update({ quantity: newQty })
    }

    res.status(201).json({
        status: "sucess"
    })
})

const deleteProductFromCart = catchAsync( async( req, res, next ) => {
    const { productId } = req.params
    const { sessionUser } = req

    const cart = await Cart.findOne({
        where: { userId: sessionUser.id, status: "active" }
    })

    if(!cart){
        return next(new AppError("There's no cart", 404))
    }

    const findProdcutInCart = await ProductsInCart.findOne({
        where: { productId, status: "active", cartId: cart.id }
    })

    if(!findProdcutInCart){
        return next(new AppError("Not product added in this cart", 404))
    }

    /* findProdcutInCart.status === "removed"
    findProdcutInCart.quantity === 0 */
    await findProdcutInCart.update({ status: "removed", quantity: 0 })

    res.status(200).json({
        status: "sucess"
    })
})

const purchaseCart = catchAsync( async( req, res, next ) => {
    const { sessionUser } = req

    const cart = await Cart.findOne({
        where: { userId: sessionUser.id, status: "active" },
        include: [{ 
            model: ProductsInCart,
            required: false,
            where: { status: "active" },
            include: [{ model: Product, required: false, where: { status: "active" } }]
        }]
    })

    if(!cart){
        return next(new AppError("Cart not found", 404))
    }

    let totalPrice = 0

    const productsPurchasedPromises = cart.productsInCarts.map(async productInCart => {
        const newQty = productInCart.product.quantity - productInCart.quantity

        const productPrice = productInCart.quantity * +productInCart.product.price
        totalPrice += productPrice

        await productInCart.product.update({ quantity: newQty })
        return await productInCart.update({ status: "purchased" })
    })

    await Promise.all(productsPurchasedPromises)

    const newOrder = await Order.create({
        userId: sessionUser.id,
        cartId: cart.id,
        totalPrice
    })

    await cart.update({ status: "purchased" })

    //Send purchase
    await new Email(sessionUser.email).sendPurchase(totalPrice, sessionUser.name, newOrder, cart.productInCarts)

    res.status(200).json({ status: "sucess", message: "Thanks for your purchase", newOrder })
})


module.exports = { getUserCart, addProductToCart, updateProductInCart, deleteProductFromCart, purchaseCart }