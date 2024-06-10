const ErrorHandler = require("../errors/errorHandler")
const Validation = require("../validations/validation")
const {
    News,
    NewsChapter,
    NewsComments, User
} = require("../database")
const path = require("path")
const uuid = require("uuid")

class NewsController {
    async getOne(req, res, next) {
        const {id} = req.params

        try {
            const news = await News.findByPk(id, {
                include: [
                    {
                        model: NewsComments,
                        include: [User]
                    },
                    {
                        model: NewsChapter
                    },
                ]
            })
            if (!news)
                return next(ErrorHandler.notFound(`Новости с номером ${id} не найдено!`))

            return res.json({news})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getRandomNews(req, res, next) {
        try {
            const count = await News.count();
            const randomIndex = Math.floor(Math.random() * count);
            const randomNewsRecord = await News.findOne({ offset: randomIndex });
            return res.json({randomNewsRecord});
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getAll(req, res, next) {
        try {
            const news = await News.findAll()
            return res.json({news})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async create(req, res, next) {
        const {
            newsTitle
        } = req.body

        let {newsContent} = req.body

        const {newsImage} = req.files
        const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

        try {
            if (!(Validation.isString(newsTitle)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректный заголовок для новости!'))

            if (newsImage === undefined)
                return next(ErrorHandler.badRequest('Пожалуйста, выберите изображение!'))
            const fileExtension = path.extname(newsImage.name).toLowerCase()
            if (!allowedImageExtensions.includes(fileExtension))
                return next(ErrorHandler.badRequest('Пожалуйста, загрузите файл в формате изображения: .jpg, .jpeg, .png или .gif!'))

            const titleCandidate = await News.findOne({where: {newsTitle}})
            if (titleCandidate)
                return next(ErrorHandler.conflict(`Новость с заголовком ${newsTitle} уже существует!`))

            let fileName = uuid.v4() + ".jpg"
            await newsImage.mv(path.resolve(__dirname, '..', 'static', fileName))

            const news = await News.create({
                newsTitle,
                newsImage: fileName
            })

            newsContent = JSON.parse(newsContent)
            await NewsChapter.bulkCreate(newsContent.map((item) => ({
                newsChapter: item.newsChapter,
                newsId: news.id
            })))

            return res.json({news})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async edit(req, res, next) {
        const {id} = req.query
        const {
            newsTitle
        } = req.body

        let newsImageFileName = null
        if (req.files && req.files.newsImage) {
            const newsImage = req.files.newsImage
            const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif']
            const fileExtension = path.extname(newsImage.name).toLowerCase()

            if (!allowedImageExtensions.includes(fileExtension))
                return next(ErrorHandler.badRequest('Пожалуйста, загрузите файл в формате изображения: .jpg, .jpeg, .png или .gif!'))

            newsImageFileName = uuid.v4() + fileExtension;

            try {
                await newsImage.mv(path.resolve(__dirname, '..', 'static', newsImageFileName))
            } catch (error) {
                return next(ErrorHandler.internal(`Ошибка при сохранении изображения: ${error}`))
            }
        }

        try {
            if (!(Validation.isString(newsTitle)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректный заголовок для новости!'))

            const news = await News.findByPk(id)
            if (!news)
                return next(ErrorHandler.conflict(`Новости с идентификатором ${id} не найдено!`))

            if (newsTitle !== news.newsTitle && await News.findOne({where: {newsTitle}}))
                return next(ErrorHandler.conflict(`Заголовок навости '${newsTitle}' уже существует!`))

            const newsUpdate = {
                newsTitle: newsTitle || news.newsTitle,
                newsImage: newsImageFileName ? newsImageFileName : news.newsImage
            }

            await news.update(newsUpdate)
            return res.json({news})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteOne(req, res, next) {
        const {id} = req.query

        try {
            const news = await News.findByPk(id)
            if (!news)
                return next(ErrorHandler.notFound(`Новости с номером ${id} не найдено!`))

            await news.destroy()
            return res.status(200).json({message: `Новость с номером ${id} успешно удалена!`})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteAll(req, res, next) {
        try {
            const news = await News.findAll()
            news.map(async (newsItem) => {
                await newsItem.destroy()
            })

            return res.status(200).json({message: 'Новости успешно удалены!'})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }
}

module.exports = new NewsController()