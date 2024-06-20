const Router = require('express')
const routes = new Router()
const HistoryController = require('../controllers/historyController')

routes.get('/one', HistoryController.getOne)
routes.get('/', HistoryController.getAll)
routes.post('/', HistoryController.create)
routes.post('/chapters', HistoryController.createChapters)
routes.put('/title', HistoryController.updateTitle)
routes.put('/chapter', HistoryController.updateChapter)
routes.delete('/title/one', HistoryController.deleteOneTitle)
routes.delete('/title/', HistoryController.deleteAllTitle)
routes.delete('/chapter/', HistoryController.deleteOneChapter)

module.exports = routes