const multer = require("multer")
const path = require("path")

//para almacenar en local
/* const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "imgs"))
    },
    filename: (req, file, cb) => {
        const filename = `${Date.now()}_${file.originalname}`
        cb(null, filename)
    }
}) */


//almacenar en memoria
const storage = multer.memoryStorage()

const upload = multer({ storage })

module.exports = { upload }