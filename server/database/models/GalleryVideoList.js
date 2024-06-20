const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const GalleryVideoList = sequelize.define('gallery_video_list', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    videoName: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isMainVideo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

module.exports = GalleryVideoList