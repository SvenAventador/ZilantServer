const {DataTypes} = require('sequelize')
const sequelize = require('../db')
const GalleryImage = require("./GalleryImage");

const HockeyGallery = sequelize.define('hockey_gallery', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    galleryTitle: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    galleryDescription: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

HockeyGallery.hasMany(GalleryImage, {as: 'image'})
GalleryImage.belongsTo(HockeyGallery)

module.exports = HockeyGallery