const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const GameMatch = sequelize.define('game_match', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    matchDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    matchTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    icePlace: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gameScore: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

module.exports = GameMatch