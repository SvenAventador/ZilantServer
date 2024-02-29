const Router = require('express')
const router = new Router()

const userRoutes = require('./authRoutes')
const personalRoutes = require('./personalRoutes')
const merchandiseRoutes = require('./merchandiseRoutes')
const newsRoutes = require('./newsRoutes')
const clubRoutes = require('./clubRoutes')
const matchRoutes = require('./matchRoutes')
const commentRoutes = require('./commentsRoutes')
const playerRoutes = require('./playerRoutes')
const galleryRoutes = require('./galleryRoutes')

router.use('/user', userRoutes)
router.use('/personal', personalRoutes)
router.use('/merchandise', merchandiseRoutes)
router.use('/news', newsRoutes)
router.use('/clubs', clubRoutes)
router.use('/match', matchRoutes)
router.use('/comment', commentRoutes)
router.use('/player', playerRoutes)
router.use('/gallery', galleryRoutes)

module.exports = router
