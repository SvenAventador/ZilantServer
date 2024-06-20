const {DataTypes} = require('sequelize')
const sequelize = require('../db')
const HistoryChapter = require("./HistoryChapter");

const History = sequelize.define('history', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    historyTitle: {
        type: DataTypes.TEXT,
        unique: true,
        allowNull: false
    }
})

History.hasMany(HistoryChapter)
HistoryChapter.belongsTo(History)

module.exports = History