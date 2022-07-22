const path = require("path")

//Models

//Utils
const { catchAsync } = require("../utils/catchAsync.utils")

const renderIndex = catchAsync( async(req, res, next) => {
    res.status(200).render("index", {
        title: "Rendered with pug"
    })
    
    /* 
    Serve static html 
    const indexPath = path.join(__dirname, "..", "public", "index.pug")

    res.status(200).render(indexPath) 
    */
})

module.exports = { renderIndex }