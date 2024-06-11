const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const MainPerson = sequelize.define('main_person', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    personSurname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    personName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    personPatronymic: {
        type: DataTypes.STRING,
        allowNull: true
    },
    personPosition: {
        type: DataTypes.STRING,
        allowNull: true
    },
    personImage: {
        type: DataTypes.TEXT,
        allowNull: true
    }
})

module.exports = MainPerson