const Router = require('express')
const routes = new Router()
const PlayerController = require('../controllers/playerController')

routes.get('/one', PlayerController.getOne)
routes.get('/goalkeepers', PlayerController.getAllGoalkeeper)
routes.get('/defender', PlayerController.getAllDefender)
routes.get('/attack', PlayerController.getAllAttack)
routes.get('/', PlayerController.getAll)
routes.post('/', PlayerController.create)
routes.put('/', PlayerController.edit)
routes.delete('/one', PlayerController.deleteOne)
routes.delete('/', PlayerController.deleteAll)

module.exports = routes