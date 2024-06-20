const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const HistoryChapter = sequelize.define('history_chapter', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    historyChapter: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

module.exports = HistoryChapter