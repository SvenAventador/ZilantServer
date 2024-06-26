const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const NewsChapter = sequelize.define('news_chapter', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    newsChapter: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

module.exports = NewsChapter