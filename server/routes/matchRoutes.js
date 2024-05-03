const Router = require('express')
const routes = new Router()
const MatchController = require('../controllers/matchController')

routes.get('/one', MatchController.getOne)
routes.get('/', MatchController.getAll)
routes.post('/', MatchController.create)
routes.put('/', MatchController.edit)
routes.delete('/one', MatchController.deleteOne)
routes.delete('/', MatchController.deleteAll)

module.exports = routes