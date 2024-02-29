const {DataTypes} = require('sequelize')
const sequelize = require('../db')
const Order = require("./Order");

const PaymentStatus = sequelize.define('payment_status', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    typeName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
})

PaymentStatus.bulkCreate([
    {
        typeName: 'Наличными'
    },
    {
        typeName: 'Банковской картой'
    },
    {
        typeName: 'Банковской картой при получении'
    }
]).then(() => {
    console.log('Записи в таблицу PaymentStatus успешно добавлены!')
}).catch((error) => {
    console.error(`Найдены следующие ошибки при добавлении записей в таблицу PaymentStatys: ${error}`)
})

PaymentStatus.hasMany(Order)
Order.belongsTo(PaymentStatus)

module.exports = PaymentStatus