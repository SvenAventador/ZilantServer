const Router = require('express')
const routes = new Router()
const GalleryController = require('../controllers/galleryController')

routes.get('/getOneGallery', GalleryController.getOne)
routes.get('/getAllGallery', GalleryController.getAll)
routes.post('/createGallery', GalleryController.create)
routes.delete('/deleteOneGallery', GalleryController.deleteOne)
routes.delete('/deleteAllGallery', GalleryController.deleteAll)

module.exports = routes