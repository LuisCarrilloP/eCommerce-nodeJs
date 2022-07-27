const express = require("express")

//Controllers
const { getUserCart, addProductToCart, updateProductInCart, deleteProductFromCart, purchaseCart } = require("../controllers/cart.controller")

//Middlewares
const { protectSession } = require("../middlewares/auth.middleware")

const cartRouter = express.Router()

cartRouter.get("/", protectSession, getUserCart)
cartRouter.post("/add-product", protectSession, addProductToCart)
cartRouter.patch("/update-cart", protectSession, updateProductInCart)
cartRouter.delete("/:productId", protectSession, deleteProductFromCart)
cartRouter.post("/purchase", protectSession, purchaseCart)

module.exports = { cartRouter }