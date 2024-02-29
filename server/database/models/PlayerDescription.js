const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const PlayerDescription = sequelize.define('player_description', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numberOfGoals: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    numberOfAssists: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    theUtilityIndicator: {
        type: DataTypes.STRING,
        defaultValue: '±0'
    },
    numberOfBlockedShots: { // +/-
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    reliabilityFactor: { // for goalkeeper
        type: DataTypes.STRING,
        defaultValue: '0%'
    }
})

module.exports = PlayerDescription