const {DataTypes} = require('sequelize')
const sequelize = require('../db')
const GalleryVideoList = require("./GalleryVideoList");

const GalleryVideo = sequelize.define('gallery_video', {
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
    },
    galleryImage: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

GalleryVideo.hasMany(GalleryVideoList, {as: 'video'})
GalleryVideoList.belongsTo(GalleryVideo)


module.exports = GalleryVideo