const ErrorHandler = require("../errors/errorHandler");
const Validation = require("../validations/validation");
const {
    News,
    NewsComments
} = require("../database");
const path = require("path");
const uuid = require("uuid");

class NewsController {
    async getOneWithComments(req, res, next) {
        const {id} = req.params

        try {
            const candidate = News.findByPk(id, {
                include: NewsComments
            })

            if (!candidate)
                return next(ErrorHandler.notFound(`Новости с номером ${id} не найдено!`))

            return res.json({candidate})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getOneWithoutComments(req, res, next) {
        const {id} = req.query

        try {
            const candidate = await News.findByPk(id)

            if (!candidate)
                return next(ErrorHandler.notFound(`Новости с номером ${id} не найдено!`))

            return res.json({candidate})
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
            newsTitle,
            newsView
        } = req.body

        const {newsImage} = req.files
        const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

        try {
            if (!(Validation.isString(newsTitle)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректный заголовок для новости!'))
            if (!(Validation.isString(newsView)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное описание новости!'))

            if (newsImage === undefined)
                return next(ErrorHandler.badRequest('Пожалуйста, выберите изображение!'))
            const fileExtension = path.extname(newsImage.name).toLowerCase()
            if (!allowedImageExtensions.includes(fileExtension))
                return next(ErrorHandler.badRequest('Пожалуйста, загрузите файл в формате изображения: jpg, jpeg, png или gif!'))

            const candidate = await News.findOne({where: {newsTitle}})
            if (candidate)
                return next(ErrorHandler.conflict(`Новость с заголовком ${newsTitle} уже существует!`))

            let fileName = uuid.v4() + ".jpg"
            await newsImage.mv(path.resolve(__dirname, '..', 'static', fileName))

            const news = await News.create({
                newsTitle,
                newsView,
                newsImage: fileName
            })

            return res.json({news})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async edit(req, res, next) {
        const {id} = req.query
        const {
            newsTitle,
            newsView
        } = req.body

        let newsImageFileName = null;
        if (req.files && req.files.newsImage) {
            const newsImage = req.files.newsImage;
            const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
            const fileExtension = path.extname(newsImage.name).toLowerCase();

            if (!allowedImageExtensions.includes(fileExtension))
                return next(ErrorHandler.badRequest('Пожалуйста, загрузите файл в формате изображения: jpg, jpeg, png или gif!'));

            newsImageFileName = uuid.v4() + fileExtension;

            try {
                await newsImage.mv(path.resolve(__dirname, '..', 'static', newsImageFileName));
            } catch (error) {
                return next(ErrorHandler.internal(`Ошибка при сохранении изображения: ${error}`));
            }
        }

        try {
            if (!(Validation.isString(newsTitle)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректный заголовок для новости!'))
            if (!(Validation.isString(newsView)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное описание новости!'))

            const candidate = await News.findByPk(id)
            if (!candidate)
                return next(ErrorHandler.conflict(`Новости с идентификатором ${id} не найдено!`))

            if (newsTitle !== candidate.newsTitle && await News.findOne({where: {newsTitle}}))
                return next(ErrorHandler.conflict(`Заголовок навости '${newsTitle}' уже существует!`))

            const candidateToUpdate = {
                newsTitle: newsTitle || candidate.newsTitle,
                newsView: newsView || candidate.newsView,
                newsImage: newsImageFileName ? newsImageFileName : candidate.newsImage
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
            await News.findByPk(id).then(async (news) => {
                if (!news)
                    return next(ErrorHandler.notFound(`Новость с номером ${id} не найдена!`))

                await news.destroy()
                return res.status(200).json({message: `Новость с номером ${id} успешно удалена!`})
            })
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteAll(req, res, next) {
        try {
            await News.findAll().then((news) => {
                if (!news.length)
                    return next(ErrorHandler.notFound('Новости не найдены!'))

                news.map((item) => {
                    item.destroy()
                })

                return res.status(200).json({message: 'Новости успешно удалены!'})
            })
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }
}

module.exports = new NewsController()