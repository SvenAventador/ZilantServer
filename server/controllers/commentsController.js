const Validation = require("../validations/validation")
const ErrorHandler = require("../errors/errorHandler")
const {
    News,
    User,
    NewsComments
} = require("../database");

class CommentsController {
    async getAll(req, res, next) {
        try {
            const comments = await NewsComments.findAll({
                include: User
            })

            return res.json({comments})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async create(req, res, next) {
        const {
            newsComment,
            newsId,
            userId
        } = req.body

        try {
            if (!(Validation.isString(newsComment)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректный комментарий!'))

            if (!await News.findByPk(newsId))
                return next(ErrorHandler.notFound(`Новости с номером ${newsId} не найдено!`))
            if (!await User.findByPk(userId))
                return next(ErrorHandler.notFound(`Пользователя с номером ${userId} не найдено!`))

            const comment = await NewsComments.create({
                newsComment,
                newsId,
                userId
            })

            return res.json({comment})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async edit(req, res, next) {
        const {id} = req.query
        const {newsComment} = req.body
        try {
            const candidate = await NewsComments.findByPk(id)
            if (!candidate)
                return next(ErrorHandler.notFound('Комментарий не найден...'))

            const candidateToUpdate = {
                newsComment: newsComment || candidate.newsComment,
                isEditable: true
            }

            await candidate.update(candidateToUpdate)
            return res.json({candidate})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteOne(req, res, next) {
        const {id} = req.query

        try {
            await NewsComments.findByPk(id).then(async (data) => {
                if (!data)
                    return next(ErrorHandler.notFound('Комментарий не найден...'))

                await data.destroy()
                return res.status(200).json({message: 'Комментарий успешно удален!'})
            })
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }
}

module.exports = new CommentsController()