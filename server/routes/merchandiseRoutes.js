const Router = require('express')
const routes = new Router()
const MerchandiseController = require('../controllers/merchandiseController')

routes.get('/getOneMerchandise/:id', MerchandiseController.getOne)
routes.get('/getAllMerchandise', MerchandiseController.getAll)
routes.post('/create', MerchandiseController.create)
routes.put('/edit', MerchandiseController.edit)
routes.delete('/deleteOneMerchandise', MerchandiseController.deleteOne)
routes.delete('/deleteAllMerchandise', MerchandiseController.deleteAll)

module.exports = routes