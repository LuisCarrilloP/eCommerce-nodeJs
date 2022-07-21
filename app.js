const express = require("express")
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const compression = require("compression")
const morgan = require("morgan")
const path = require("path")

//Routes
const { userRouter } = require("./routes/user.routes")
const { productRouter } = require("./routes/product.routes")
const { viewsRouter } = require("./routes/views.routes")

//Global err controller
const { globalErrorHandler } = require("./controllers/globalErrorHandler.controllers")

//Utils
const { AppError } = require("./utils/appError.utils")

//Init app
const app = express()

//Allow json
app.use(express.json())

//Serving static files
app.use(express.static(path.join(__dirname, "public")))

//Set template engine
app.set("view engine", "pug")

//Limit the number of requests
const limiter = rateLimit({
    max: 10000,
    windowMs: 60 * 60 * 1000,
    message: "Number of request have been exceeded"
})

app.use(limiter)


//Add security headers
app.use(helmet())

//compress responses
app.use(compression())

//Log incoming request
if(process.env.NODE_ENV === "development") app.use(morgan("dev"))
else app.use(morgan("combined"))

//Endpoints
app.use("/", viewsRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/products", productRouter)
    
//Handle unknown routes
app.all("*", (req, res, next) => {
    next(new AppError(`${req.method} ${req.originalUrl} not found in this server`, 404))
})

//Global Error Handler
app.use(globalErrorHandler)
    



module.exports = { app }