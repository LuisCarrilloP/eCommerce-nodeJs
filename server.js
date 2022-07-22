const { app } = require("./app")

const { initModels } = require("./models/init.models")

//Utils
const { db } = require("./utils/database.utils")

//Authenticate
db.authenticate()
    .then(console.log("Db authenticated..."))
    .catch(err => console.log(err))



//Relations
initModels()

//Sync
db.sync()
    .then(console.log("Db synced..."))
    .catch(err => console.log(err))

const PORT = process.env.PORT || 4500

app.listen(PORT, () => {
    console.log('Express app running!!');
});

