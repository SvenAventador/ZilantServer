const Router = require('express')
const routes = new Router()
const MatchController = require('../controllers/matchController')

routes.get('/getOneMatch', MatchController.getOne)
routes.get('/getAllMatch', MatchController.getAll)
routes.post('/createMatch', MatchController.create)
routes.put('/editMatch', MatchController.edit)
routes.delete('/deleteOneMatch', MatchController.deleteOne)
routes.delete('/deleteAllMatch', MatchController.deleteAll)

module.exports = routes