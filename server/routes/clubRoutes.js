const Router = require('express')
const routes = new Router()
const ClubController = require('../controllers/clubController')

routes.get('/getOneClub', ClubController.getOne)
routes.get('/getAllClub', ClubController.getAll)
routes.post('/createClub', ClubController.create)
routes.put('/editClub', ClubController.edit)
routes.delete('/deleteOneClub', ClubController.deleteOne)
routes.delete('/deleteAllClub', ClubController.deleteAll)

module.exports = routes