const Router = require('express')
const routes = new Router()
const CartController = require('../controllers/cartController')

routes.get('/:id', CartController.getAllGoods)
routes.get('/', CartController.getOne)
routes.post('/:id', CartController.createGood)
routes.put('/:id', CartController.updateAmountGood)
routes.delete('/one/:id', CartController.deleteGood)
routes.delete('/:id', CartController.deleteAllGood)

module.exports = routes