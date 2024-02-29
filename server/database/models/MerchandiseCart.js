const {DataTypes} = require("sequelize");
const sequelize = require('../db')
const MerchandiseCart = sequelize.define('merchandise_cart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    count: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
})

module.exports = MerchandiseCart