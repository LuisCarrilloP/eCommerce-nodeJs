const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")

dotenv.config({ path: "./config.env" })

//Models
const { User } = require("../models/user.models");

//Utils
const { AppError } = require("../utils/appError.utils");
const { catchAsync } = require("../utils/catchAsync.utils");


const protectSession = catchAsync( async( req, res, next ) => {
    let token
    
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]
    }

    if(!token){
        next(new AppError("Invalid session", 403))
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET)

    //ask jwt if token is valid
    const user = await User.findOne({ where: { id: decoded.id, status: "active" }})

    if(!user){
        return next(new AppError("The owner of this token doesnt exist anymore", 403))
    }
    req.sessionUser = user

    next()
})

const protectUserAccount = catchAsync( async( req, res, next ) => {
    const { sessionUser, user } = req

    if(sessionUser.id !== user.id){
        return next(new AppError("You can't manage this account", 403))
    }

    next()
})

module.exports = { protectSession, protectUserAccount }