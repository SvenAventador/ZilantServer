const {DataTypes} = require('sequelize')
const sequelize = require('../db')
const PlayerDescription = require("./PlayerDescription");

const ClubPlayer = sequelize.define('club_player', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    playerSurname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    playerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    playerPatronymic: {
        type: DataTypes.STRING,
        allowNull: true
    },
    playerNumber: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false
    },
    playerImage: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    playerPosition: {
        type: DataTypes.ENUM('Вратарь', 'Защитник', 'Нападающий')
    }
})

ClubPlayer.hasOne(PlayerDescription)
PlayerDescription.belongsTo(ClubPlayer)

module.exports = ClubPlayer