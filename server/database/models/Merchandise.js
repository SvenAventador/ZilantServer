const {DataTypes} = require('sequelize')
const sequelize = require('../db')
const MerchandiseCart = require("./MerchandiseCart");
const MerchandiseOrder = require("./MerchandiseOrder");

const Merchandise = sequelize.define('merchandise', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    merchandiseName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    merchandiseDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    merchandiseAmount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    merchandisePrice: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    merchandiseImage: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

Merchandise.hasMany(MerchandiseCart)
MerchandiseCart.belongsTo(Merchandise)

Merchandise.hasMany(MerchandiseOrder)
MerchandiseOrder.belongsTo(Merchandise)

module.exports = Merchandise