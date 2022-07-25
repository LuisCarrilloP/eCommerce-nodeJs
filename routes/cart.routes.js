const express = require("express")

//Controllers
const { addProductToCart, updateCart, deleteProduct } = require("../controllers/cart.controller")

//Middlewares
const { protectSession } = require("../middlewares/auth.middleware")

cartRouter = express.Router()

cartRouter.post("/add-product", protectSession, addProductToCart)
cartRouter.patch("/update-cart", protectSession, updateCart)
cartRouter.delete("/:productId", protectSession, deleteProduct)
cartRouter.post("/purchase", protectSession)

module.exports = { cartRouter }