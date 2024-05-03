const ErrorHandler = require("../errors/errorHandler")
const {Merchandise} = require("../database")
const Validation = require("../validations/validation")
const path = require("path")
const uuid = require("uuid")

class MerchandiseController {
    async getOne(req, res, next) {
        const {id} = req.params

        try {
            const merchandise = await Merchandise.findByPk(id)
            if (!merchandise)
                return next(ErrorHandler.conflict(`Мерча с номером ${id} не существует!`))

            return res.json({merchandise})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getAll(req, res, next) {
        try {
            const merchandises = await Merchandise.findAll()
            return res.json({merchandises})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async create(req, res, next) {
        const {
            merchandiseName,
            merchandiseDescription,
            merchandiseAmount,
            merchandisePrice
        } = req.body
        const {merchandiseImage} = req.files || {}
        const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif']

        try {
            if (!(Validation.isString(merchandiseName)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректно название атрибутики!'))
            if (!(Validation.isString(merchandiseDescription)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректно описание атрибутики!'))
            if (!(Validation.isNumber(merchandiseAmount)) && merchandiseAmount <= 0)
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректно количество атрибутики! Количество атрибутики должно быть равно минимум    одному!'))
            if (!(Validation.isNumber(merchandisePrice)) && merchandisePrice < 1000)
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректно цену атрибутики! Минимальная цена атрибутики равна 1000₽!'))

            if (merchandiseImage === undefined)
                return next(ErrorHandler.badRequest('Пожалуйста, выберите изображение!'))
            const fileExtension = path.extname(merchandiseImage.name).toLowerCase()
            if (!allowedImageExtensions.includes(fileExtension))
                return next(ErrorHandler.badRequest('Пожалуйста, загрузите файл в формате изображения: .jpg, .jpeg, .png или .gif!'))

            const merchandises = await Merchandise.findOne({where: {merchandiseName}})
            if (merchandises)
                return next(ErrorHandler.conflict(`Товар с названием ${merchandiseName} уже существует!`))

            let fileName = uuid.v4() + ".jpg"
            await merchandiseImage.mv(path.resolve(__dirname, '..', 'static', fileName))

            const merchandise = await Merchandise.create({
                merchandiseName,
                merchandiseDescription,
                merchandiseAmount,
                merchandisePrice,
                merchandiseImage: fileName
            })

            return res.json({merchandise})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async edit(req, res, next) {
        const {id} = req.query
        const {
            merchandiseName,
            merchandiseDescription,
            merchandiseAmount,
            merchandisePrice
        } = req.body

        let merchandiseImageFileName = null
        if (req.files && req.files.merchandiseImage) {
            const merchandiseImage = req.files.merchandiseImage
            const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif']
            const fileExtension = path.extname(merchandiseImage.name).toLowerCase();

            if (!allowedImageExtensions.includes(fileExtension))
                return next(ErrorHandler.badRequest('Пожалуйста, загрузите файл в формате изображения: .jpg, .jpeg, .png или .gif!'))

            merchandiseImageFileName = uuid.v4() + fileExtension

            try {
                await merchandiseImage.mv(path.resolve(__dirname, '..', 'static', merchandiseImageFileName))
            } catch (error) {
                return next(ErrorHandler.internal(`Ошибка при сохранении изображения: ${error}`))
            }
        }

        try {
            if (merchandiseName && (!(Validation.isString(merchandiseName))))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректно название атрибутики!'))
            if (merchandiseDescription && (!(Validation.isString(merchandiseDescription))))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректно описание атрибутики!'))
            if (merchandiseAmount && (!(Validation.isNumber(merchandiseAmount)) && merchandiseAmount <= 0))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректно количество атрибутики! Количество атрибутики должно быть равно одному!'))
            if (merchandisePrice && (!(Validation.isNumber(merchandisePrice)) && merchandisePrice < 1000))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректно цену атрибутики! Минимальная цена атрибутики равна 1000₽!'))

            const merchandise = await Merchandise.findByPk(id)
            if (!merchandise)
                return next(ErrorHandler.notFound(`Товара с номером ${id} не найдено!`))

            if (merchandiseName !== merchandise.merchandiseName && await Merchandise.findOne({where: {merchandiseName}}))
                return next(ErrorHandler.conflict(`Товар с названием ${merchandiseName} уже существует!`))

            const merchandiseToUpdate = {
                merchandiseName: merchandiseName || merchandise.merchandiseName,
                merchandiseDescription: merchandiseDescription || merchandise.merchandiseDescription,
                merchandiseAmount: merchandiseAmount || merchandise.merchandiseAmount,
                merchandisePrice: merchandisePrice || merchandise.merchandisePrice,
                merchandiseImage: merchandiseImageFileName ? merchandiseImageFileName : merchandise.merchandiseImage
            }

            await merchandise.update(merchandiseToUpdate)
            return res.json({merchandise})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteOne(req, res, next) {
        const {id} = req.query

        try {
            const merchandise = await Merchandise.findByPk(id)
            if (!merchandise)
                return next(ErrorHandler.notFound(`Товара с номером ${id} не существует!`))

            await merchandise.destroy()
            return res.status(200).json({message: `Товар с номером ${id} успешно удален!`})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteAll(req, res, next) {
        try {
            const merchandises = await Merchandise.findAll()
            merchandises.map(async (merchandise) => {
                await merchandise.destroy()
            })

            return res.status(200).json({message: 'Товары успешно удалены!'})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }
}

module.exports = new MerchandiseController()