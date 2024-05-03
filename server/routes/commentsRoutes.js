const Router = require('express')
const routes = new Router()
const CommentController = require('../controllers/commentsController')

routes.get('/', CommentController.getAll)
routes.post('/:newsId', CommentController.create)
routes.put('/', CommentController.edit)
routes.delete('/', CommentController.deleteOne)

module.exports = routes