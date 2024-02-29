const {DataTypes} = require('sequelize')
const sequelize = require('../db')
const MerchandiseCart = require("./MerchandiseCart");

const Cart = sequelize.define('cart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
})

Cart.hasMany(MerchandiseCart)
MerchandiseCart.belongsTo(Cart)

module.exports = Cart