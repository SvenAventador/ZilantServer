const Router = require('express')
const routes = new Router()
const MainPersonController = require('../controllers/mainPersonController')

routes.get('/one', MainPersonController.getOne)
routes.get('/', MainPersonController.getAll)
routes.post('/', MainPersonController.create)
routes.put('/', MainPersonController.edit)
routes.delete('/one', MainPersonController.deleteOne)
routes.delete('/', MainPersonController.deleteAll)

module.exports = routes