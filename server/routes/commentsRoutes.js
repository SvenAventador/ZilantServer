const Router = require('express')
const routes = new Router()
const CommentController = require('../controllers/commentsController')

routes.get('/getAllComment', CommentController.getAll)
routes.post('/createComment', CommentController.create)
routes.put('/updateComment', CommentController.edit)
routes.delete('/deleteOneComment', CommentController.deleteOne)

module.exports = routes