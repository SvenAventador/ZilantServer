const Router = require('express')
const routes = new Router()
const MerchandiseController = require('../controllers/merchandiseController')

routes.get('/:id', MerchandiseController.getOne)
routes.get('/', MerchandiseController.getAll)
routes.post('/', MerchandiseController.create)
routes.put('/', MerchandiseController.edit)
routes.delete('/one', MerchandiseController.deleteOne)
routes.delete('/', MerchandiseController.deleteAll)

module.exports = routes