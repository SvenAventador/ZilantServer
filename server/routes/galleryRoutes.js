const Router = require('express')
const routes = new Router()
const GalleryController = require('../controllers/galleryController')

routes.get('/:id', GalleryController.getOne)
routes.get('/', GalleryController.getAll)
routes.post('/', GalleryController.create)
routes.delete('/one', GalleryController.deleteOne)
routes.delete('/', GalleryController.deleteAll)

module.exports = routes