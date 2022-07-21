const { app } = require("./app")

const { db } = require("./utils/database.utils")

//Models
const { User } = require("./models/user.models")
const { Product } = require("./models/product.models")
const { Category } = require("./models/category.models")
const { ProductImgs } = require("./models/productImgs.models")
const { Order } = require("./models/order.models")
const { Cart } = require("./models/cart.models")
const { ProductsInCart } = require("./models/productsInCart.models")

//Authenticate
db.authenticate()
    .then(console.log("Db authenticated..."))
    .catch(err => console.log(err))



//Relations
    //User 1 ---- M Orders
    User.hasMany(Order, { foreignKey: "userId" })
    Order.belongsTo(User)

    //User 1 ---- 1 Cart
    User.hasOne(Cart, { foreignKey: "userId" })
    Cart.belongsTo(User)

    //Product 1 --- M ProductImgs
    /* Product.hasMany(ProductImgs, { foreignKey: "productId" })
    Product.belongsTo(Product) */

    //Category 1 --- M Products
    Category.hasMany(Product, { foreignKey: "categoryId" })
    Product.belongsTo(Category)

    //Cart 1 --- M ProductsInCart
    Cart.hasMany(ProductsInCart, { foreignKey: "cartId" })
    ProductsInCart.belongsTo(Cart)



//Sync
db.sync()
    .then(console.log("Db synced..."))
    .catch(err => console.log(err))

const PORT = process.env.PORT || 4500

app.listen(PORT, () => {
    console.log('Express app running!!');
});

