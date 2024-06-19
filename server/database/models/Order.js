const {DataTypes} = require('sequelize')
const sequelize = require('../db')
const MerchandiseOrder = require("./MerchandiseOrder");

const Order = sequelize.define('order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dateOrder: {
        type: DataTypes.DATEONLY,
        defaultValue: Date.now()
    },
    fullPrice: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
})

Order.hasMany(MerchandiseOrder)
MerchandiseOrder.belongsTo(Order)

module.exports = Order