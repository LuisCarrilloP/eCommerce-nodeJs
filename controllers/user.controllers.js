const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config({ path: "./config.env" })

//Models
const { User } = require("../models/user.models")
const { Order } = require("../models/order.models")
const { Cart } = require("../models/cart.models")
const { Product } = require("../models/product.models")
const { ProductsInCart } = require("../models/productsInCart.models")

//Utils
const { AppError } = require("../utils/appError.utils")
const { catchAsync } = require("../utils/catchAsync.utils")
const { Email } = require("../utils/email.utils")



                    /*_____________ ACTIONS ______________*/

const createUser = catchAsync( async( req, res, next ) => {
    const { name, email, password } = req.body

    //Hash password
    const salt = await bcrypt.genSalt(12)
    const hashPassword = await bcrypt.hash(password, salt)

    const newUser = await User.create({
        name,
        email,
        password: hashPassword
    })

    //Remove password from response
    newUser.password = undefined

    //Send welcome email
    await new Email(email).sendWelcome(name)

    res.status(201).json({
        status: "sucess",
        newUser
    })

})

const login = catchAsync( async( req, res, next ) => {
    const { email, password } = req.body

    //Validar credenciales
    const user = await User.findOne({ where: { email, status: "active" } })

    if(!user){
        return next(new AppError("Invalid Credentials", 404))
    }

    //Validar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
        return next(new AppError("Invalid Credentials", 404))
    }

    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" })

    res.status(200).json({
        status: "sucess",
        message: `Welcome ${user.name}`,
        token
    })
})

const getAllUsers = catchAsync( async( req, res, next ) => {
    const users = await User.findAll({
        /* where: { status: "active" || "disabled" } */
        attributes: ["id", "name", "status"]
    })

    res.status(200).json({
        status: "sucess",
        users
    })
})

const getUserProducts = catchAsync( async( req, res, next ) => {
    const { userSession } = req
    const userProducts = await Product.findAll({
        where: { userId: userSession.id }
    })

    if(!userProducts){
        return next("No products made by this user", 400)
    }

    res.status(200).json({
        status: "sucess",
        userProducts
    })
})

const updateUser = catchAsync( async( req, res, next ) => {
    const { user } = req
    const { name, email } = req.body

    const userUpdate = await user.update({
        name,
        email
    })

    userUpdate.password = undefined

    res.status(201).json({
        status: "sucess",
        userUpdate
    })
})

const deleteUser = catchAsync( async( req, res, next ) => {
    const { user } = req

    const userDisabled = await user.update({ status: "disabled" })

    userDisabled.password = undefined

    res.status(201).json({
        status: "sucess",
        message: "User has been disabled",
        userDisabled
    })

})

const getAllOrdersByUser = catchAsync( async( req, res, next ) => {
    const { sessionUser } = req

    const userOrders = await Order.findAll({
        where: { userId: sessionUser.id },
        include: [
            { model: Cart, 
                required:false,
                include: { 
                    model: ProductsInCart,
                        required: false,
                        include: { 
                            model: Cart,
                                required: false
                        }
                    }
            }
        ]
    })

    if(!userOrders){
        return next(new AppError("No orders to show", 400))
    }

    res.status(200).json({
        status: "sucess",
        userOrders
    })
})

const getOrderById = catchAsync( async ( req, res, next ) => {
    const { order } = req

    const orderId = await Order.findOne({
        where: { status: "active", id: order.id }, 
        include: [{model: User}]
    })

    if(!orderId){
        return next(new AppError("No order found", 404))
    }

    res.status(200).json({
        status: "sucess",
        orderId
    })
})

module.exports = { createUser, login, getAllUsers, getUserProducts, updateUser, deleteUser, getAllOrdersByUser, getOrderById }