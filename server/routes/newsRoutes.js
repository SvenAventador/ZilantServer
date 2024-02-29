const Router = require('express')
const routes = new Router()
const NewsController = require('../controllers/newsController')

routes.get('/getOneNewsWithComments/:id', NewsController.getOneWithComments)
routes.get('/getOneNewsWithoutComments', NewsController.getOneWithoutComments)
routes.get('/getAllNews', NewsController.getAll)
routes.post('/createNews', NewsController.create)
routes.put('/editNews', NewsController.edit)
routes.delete('/deleteOneNews', NewsController.deleteOne)
routes.delete('/deleteAllNews', NewsController.deleteAll)

module.exports = routes