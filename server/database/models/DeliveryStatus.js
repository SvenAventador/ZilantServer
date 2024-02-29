const {DataTypes} = require('sequelize')
const sequelize = require('../db')
const Order = require("./Order");

const DeliveryStatus = sequelize.define('delivery_status', {
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

DeliveryStatus.bulkCreate([
    {
        typeName: 'Заказ обрабатывается'
    },
    {
        typeName: 'Заказ обработан'
    },
    {
        typeName: 'Заказ в доставке'
    },
    {
        typeName: 'Заказ готов к получению'
    },
    {
        typeName: 'Заказ в городе'
    },
    {
        typeName: 'Заказ получен'
    }
]).then(() => {
    console.log('Записи в таблицу DeliveryStatus успешно добавлены!')
}).catch((error) => {
    console.error(`Найдены следующие ошибки при добавлении записей в таблицу DeliveryStatus: ${error}`)
})

DeliveryStatus.hasMany(Order)
Order.belongsTo(DeliveryStatus)

module.exports = DeliveryStatus