const express = require("express")

//Controllers
const { renderIndex } = require("../controllers/views.controller")

const viewsRouter = express.Router()

viewsRouter.get("/", renderIndex)

module.exports = { viewsRouter }