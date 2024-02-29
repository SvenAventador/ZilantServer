const Router = require('express')
const routes = new Router()
const PersonalController = require('../controllers/personalController')

routes.put('/edit', PersonalController.editData)

module.exports = routes