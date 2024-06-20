const Router = require('express')
const routes = new Router()
const OrderController = require('../controllers/orderController')

routes.get('/:id', OrderController.getAllUserOrders)
routes.get('/', OrderController.getAllOrders)
routes.post('/:id', OrderController.createOrder)
routes.put('/', OrderController.changeDeliveryStatus)

module.exports = routes