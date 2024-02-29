const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const MerchandiseOrder = sequelize.define('merchandise_order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
})

module.exports = MerchandiseOrder