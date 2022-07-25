const express = require("express")

//Controllers
const { createUser, login, getAllUsers, getUserProducts, updateUser, deleteUser, getAllOrdersByUser, getOrderById } = require("../controllers/user.controllers")

//Middlewares
const { createUserValidators } = require("../middlewares/validators.middlewares")
const { userExist, } = require("../middlewares/userExist.middleware")
const { protectSession, protectUserAccount } = require("../middlewares/auth.middleware")



const userRouter = express.Router()

userRouter.post("/", createUserValidators, createUser)
userRouter.post("/login", login)

userRouter.get("/", /* protectSession, */ getAllUsers)
userRouter.get("/me", protectSession, getUserProducts)

userRouter.patch("/:id", protectSession, userExist, protectUserAccount, updateUser)
userRouter.delete("/:id", protectSession, userExist, protectUserAccount, deleteUser)
userRouter.get("/orders", protectSession, getAllOrdersByUser)
userRouter.get("/orders/id", protectSession, getOrderById)

module.exports = { userRouter }