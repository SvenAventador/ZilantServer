const ErrorHandler = require("../errors/errorHandler");
const {HockeyGallery, GalleryImage, Merchandise} = require("../database");
const Validation = require("../validations/validation");
const path = require("path");
const crypto = require('crypto')

class GalleryController {
    async getAll(req, res, next) {
        try {
            const gallery = await HockeyGallery.findAll({
                include: {
                    model: GalleryImage,
                    as: 'image',
                    where: {
                        isMainImage: true
                    }
                }
            })

            return res.json({gallery})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getOne(req, res, next) {
        const {id} = req.query

        try {
            const candidate = await HockeyGallery.findByPk(id, {
                include: {
                    model: GalleryImage,
                    as: 'image'
                }
            })
            if (!candidate)
                return next(ErrorHandler.badRequest(`Галлереи с номером ${id} не найдено!`))

            return res.json({candidate})
        } catch (error) {

        }
    }

    async create(req, res, next) {
        const {
            galleryTitle,
            galleryDescription
        } = req.body
        const image = req.files?.image

        try {
            if (!(Validation.isString(galleryTitle)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное название галереи!'))
            if (!(Validation.isString(galleryDescription)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное описание галлереи!!'))

            const candidate = await HockeyGallery.findOne({where: {galleryTitle}})
            if (candidate)
                return next(ErrorHandler.conflict(`Галлерея с названием ${galleryTitle} уже существует!`))

            const gallery = await HockeyGallery.create({
                galleryTitle,
                galleryDescription
            })

            let galleryImage = []

            if (image && Array.isArray(image)) {
                for (let images of image) {
                    const fileName = crypto.randomBytes(16).toString('hex') + '.jpg'
                    await images.mv(path.resolve(__dirname, '..', 'static', fileName))
                    galleryImage.push({imageName: fileName})
                }
            }

            if (galleryImage.length > 0) {
                await Promise.all(galleryImage.map((image, index) =>
                        GalleryImage.create({
                            imageName: image.imageName,
                            hockeyGalleryId: gallery.id,
                            isMainImage: index === 0
                        })
                    )
                );
            } else if (galleryImage.length <= 0) {
                return next(ErrorHandler.conflict("Пожалуйста, добавьте хотя бы одно изображение в галлерею!"))
            }

            return res.json({gallery})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteOne(req, res, next) {
        const {id} = req.query

        try {
            const candidate = await HockeyGallery.findByPk(id)
            await GalleryImage.findAll({where: {hockeyGalleryId: candidate.id}}).then((data) => {
                data.map(async (item) => {
                    await item.destroy()
                })
            })

            await candidate.destroy()
            return res.status(200).json({message: `Галерея с номером ${id} успешно удалена!`})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteAll(req, res, next) {
        try {
            await GalleryImage.findAll().then((data) => {
                data.map(async (item) => {
                    await item.destroy()
                })
            })
            await HockeyGallery.findAll().then((data)  => {
                if (!data.length)
                    return next(ErrorHandler.notFound(`Галереи не найдены!`))

                data.map(async (item) => {
                    await item.destroy()
                })
                return res.status(200).json({message: 'Галереи успешно удалены!'})
            })
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }
}

module.exports = new GalleryController()