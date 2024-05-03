const Router = require('express')
const routes = new Router()
const ClubController = require('../controllers/clubController')

routes.get('/one', ClubController.getOne)
routes.get('/', ClubController.getAll)
routes.post('/', ClubController.create)
routes.put('/', ClubController.edit)
routes.delete('/one', ClubController.deleteOne)
routes.delete('/', ClubController.deleteAll)

module.exports = routes