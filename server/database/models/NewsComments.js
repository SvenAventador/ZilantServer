const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const NewsComments = sequelize.define('news_comments', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    newsComment: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isEditable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

module.exports = NewsComments