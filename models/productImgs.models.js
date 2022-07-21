const { db, DataTypes } = require("../utils/database.utils")

const ProductImgs = db.define("productImgs", {
    id: {
		primaryKey: true,
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
	},
    imgUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
		allowNull: false,
        defaultValue: "active"     
    }
})

module.exports = { ProductImgs }