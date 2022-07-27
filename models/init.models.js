//Models
const { User } = require("./user.models")
const { Product } = require("./product.models")
const { Cart } = require("./cart.models")
const { ProductsInCart } = require("./productsInCart.models")
const { Order } = require("./order.models")
const { ProductImgs } = require("./productImgs.models")
const { Category } = require("./category.models")

const initModels = () => {
    //User 1 ---- M Product
    User.hasMany(Product, { foreignKey: "userId" })
    Product.belongsTo(User)
    //User 1 ---- M Orders
    User.hasMany(Order, { foreignKey: "userId" })
    Order.belongsTo(User)
    //User 1 ---- 1 Cart
    User.hasOne(Cart, { foreignKey: "userId" })
    Cart.belongsTo(User)


    //Product 1 --- M ProductImgs
    Product.hasMany(ProductImgs, { foreignKey: "productId" })
    ProductImgs.belongsTo(Product)
    //Category 1 --- M Products
    Category.hasOne(Product, { foreignKey: "categoryId" })
    Product.belongsTo(Category)
    //Cart 1 --- M ProductsInCart
    Cart.hasMany(ProductsInCart, { foreignKey: "cartId" }) /* **** */
    ProductsInCart.belongsTo(Cart)

    
    //Product 1 ---- 1 ProductInCart
    Product.hasOne(ProductsInCart)
    ProductsInCart.belongsTo(Product)
    //Cart 1 --- 1 Order
    Cart.hasOne(Order, { foreignKey: "cartId" })
    Order.belongsTo(Cart)
}

module.exports = { initModels }