const {DataTypes} = require('sequelize')
const sequelize = require('../db')
const GameMatch = require("./GameMatch");

const HockeyClub = sequelize.define('hockey_club', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    clubName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    clubPoint: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    clubImage: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

HockeyClub.bulkCreate([
    {
        clubName: 'ХК «КАИ-ЗИЛАНТ»',
        clubPoint: 0,
        clubImage: 'KAI-ZILANT.jpg'
    }
]).then(() => {
    console.log('Успешно создан клуб ХК «КАИ-ЗИЛАНТ»!')
}).catch((error) => {
    console.error(`Во время создания клуба произошли ошибки: ${error}`)
})

HockeyClub.hasMany(GameMatch)
GameMatch.belongsTo(HockeyClub)

module.exports = HockeyClub