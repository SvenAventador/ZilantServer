const {DataTypes} = require('sequelize')
const sequelize = require('../db')
const Cart = require("./Cart");
const Order = require("./Order");
const NewsComments = require("./NewsComments");

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    userEmail: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    userPassword: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userRole: {
        type: DataTypes.ENUM('ADMIN', 'USER'),
        defaultValue: 'USER'
    },
    userFio: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userPhone: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

User.hasOne(Cart)
Cart.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(NewsComments)
NewsComments.belongsTo(User)

module.exports = User