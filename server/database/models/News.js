const {DataTypes} = require('sequelize')
const sequelize = require('../db')
const NewsComments = require("./NewsComments")
const NewsChapter = require("./NewsChapter")

const News = sequelize.define('news', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    newsTitle: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    newsDescription: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    newsDate: {
        type: DataTypes.DATEONLY,
        defaultValue: Date.now()
    },
    newsImage: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

News.hasMany(NewsComments)
NewsComments.belongsTo(News)

News.hasMany(NewsChapter)
NewsChapter.belongsTo(News)


module.exports = News