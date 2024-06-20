const ErrorHandler = require("../errors/errorHandler")
const {
    News,
    User,
    NewsComments
} = require("../database")

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
        const {newsId} = req.params
        const {
            newsComment,
            userId
        } = req.body

        try {
            const news = await News.findByPk(newsId)
            if (!news)
                return next(ErrorHandler.notFound(`Новости под номером ${newsId} не существует!`))
            const user = await User.findByPk(userId)
            if (!user)
                return next(ErrorHandler.notFound(`Пользователя под номером ${userId} не существует!`))

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
        const {newsComment, userId} = req.body

        try {
            const comment = await NewsComments.findByPk(id)
            if (!comment)
                return next(ErrorHandler.notFound('Данного комментария не найдено!'))

            if (comment.userId !== userId)
                return next(ErrorHandler.conflict('Это не Ваш комментарий. Изменять ничего нельзя!'))

            const updateComment = {
                newsComment: newsComment || comment.newsComment,
                isEditable: true
            }

            await comment.update(updateComment)
            return res.json({comment})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteOne(req, res, next) {
        const {id} = req.query

        try {
            const currentComment = await NewsComments.findByPk(id)
            if (!currentComment)
                return next(ErrorHandler.notFound('Комментарий не найден!'))

            await currentComment.destroy()
            return res.status(200).json({message: 'Комментарий успешно удален!'})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }
}

module.exports = new CommentsController()