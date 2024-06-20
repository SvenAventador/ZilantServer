const Router = require('express')
const routes = new Router()
const VideoController = require('../controllers/galleryVideoController')

routes.get('/all', VideoController.getAll)
routes.get('/video', VideoController.getAllWithVideo)
routes.get('/:id', VideoController.getOne)
routes.post('/', VideoController.create)
routes.delete('/one', VideoController.deleteOne)
routes.delete('/', VideoController.deleteAll)

module.exports = routes