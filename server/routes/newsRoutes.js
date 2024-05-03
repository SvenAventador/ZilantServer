const Router = require('express')
const routes = new Router()
const NewsController = require('../controllers/newsController')

routes.get('/:id', NewsController.getOne)
routes.get('/', NewsController.getAll)
routes.post('/', NewsController.create)
routes.put('/', NewsController.edit)
routes.delete('/one', NewsController.deleteOne)
routes.delete('/', NewsController.deleteAll)

module.exports = routes