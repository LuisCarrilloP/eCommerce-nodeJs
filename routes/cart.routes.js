const express = require("express")

//Middlewares
const { protectSession } = require("../middlewares/auth.middleware")

cartRouter = express.Router()

cartRouter.post("/add-product", protectSession)
cartRouter.patch("/update-cart", protectSession)
cartRouter.delete("/:productId", protectSession)
cartRouter.post("/purchase", protectSession)

module.exports = { cartRouter }