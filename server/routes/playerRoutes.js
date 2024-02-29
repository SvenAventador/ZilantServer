const Router = require('express')
const routes = new Router()
const PlayerController = require('../controllers/playerController')

routes.get('/getOnePlayer', PlayerController.getOne)
routes.get('/getAllPlayer', PlayerController.getAll)
routes.post('/create', PlayerController.create)
routes.put('/edit', PlayerController.edit)
routes.delete('/deleteOnePlayer', PlayerController.deleteOne)
routes.delete('/deleteAllPlayer', PlayerController.deleteAll)

module.exports = routes