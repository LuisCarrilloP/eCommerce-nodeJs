//Models
const { User } = require("./user.models")
const { Product } = require("./product.models")
const { Category } = require("./category.models")
const { ProductImgs } = require("./productImgs.models")
const { Order } = require("./order.models")
const { Cart } = require("./cart.models")
const { ProductsInCart } = require("./productsInCart.models")

const initModels = () => {
    //User 1 ---- M Orders
    User.hasMany(Order, { foreignKey: "userId" })
    Order.belongsTo(User)

    //User 1 ---- 1 Cart
    User.hasOne(Cart, { foreignKey: "userId" })
    Cart.belongsTo(User)

    //Product 1 --- M ProductImgs
    Product.hasMany(ProductImgs, { foreignKey: "productId" })
    Product.belongsTo(Product)

    //Category 1 --- M Products
    Category.hasMany(Product, { foreignKey: "categoryId" })
    Product.belongsTo(Category)

    //Cart 1 --- M ProductsInCart
    Cart.hasMany(ProductsInCart, { foreignKey: "cartId" })
    ProductsInCart.belongsTo(Cart)
}

module.exports = { initModels }