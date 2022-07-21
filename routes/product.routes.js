const express = require("express")

//Routes
const { createProduct, createCategory, getAllProducts, getProductById, updateProduct, deleteProduct, getAllCategories, updateCategoryName } = require("../controllers/product.controllers")

//Middlewares
const { createProductValidators } = require("../middlewares/validators.middlewares")
const { protectSession } = require("../middlewares/auth.middleware")
const { productExist } = require("../middlewares/productExist.middleware")
const { categoryExist } = require("../middlewares/categoryExist.middleware")

const productRouter = express.Router()

productRouter.post("/", protectSession, createProductValidators, createProduct)
productRouter.get("/", getAllProducts) /* ***** */
productRouter.get("/:id", productExist, getProductById )
productRouter.patch("/:id", protectSession, productExist, updateProduct)
productRouter.delete("/:id", protectSession, productExist, deleteProduct)
productRouter.get("/categories", getAllCategories) /* ***** */
productRouter.post("/categories", protectSession, createCategory)
productRouter.patch("/categories/:id",protectSession, categoryExist, updateCategoryName)

module.exports = { productRouter }