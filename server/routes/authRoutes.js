const Router = require('express')
const routes = new Router()
const AuthController = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')

routes.post('/registration', AuthController.registration)
routes.post('/login', AuthController.login)
routes.get('/auth', authMiddleware, AuthController.check)
routes.get('/logout', authMiddleware, AuthController.logout)

module.exports = routes