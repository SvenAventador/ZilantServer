const {DataTypes, TEXT} = require('sequelize')
const sequelize = require('../db')
const NewsComments = require("./NewsComments");

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
    newsDate: {
        type: DataTypes.DATEONLY,
        defaultValue: Date.now()
    },
    newsImage: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    newsView: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

News.hasMany(NewsComments)
NewsComments.belongsTo(News)

module.exports = News