const Router = require('express')
const routes = new Router()
const PersonalController = require('../controllers/personalController')

routes.put('/:id', PersonalController.editData)

module.exports = routes