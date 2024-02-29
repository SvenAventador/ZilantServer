const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const GalleryImage = sequelize.define('gallery_image', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    imageName: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isMainImage: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

module.exports = GalleryImage