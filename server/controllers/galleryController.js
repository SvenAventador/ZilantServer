const ErrorHandler = require("../errors/errorHandler")
const {
    HockeyGallery,
    GalleryImage,
} = require("../database")
const Validation = require("../validations/validation")
const path = require("path")
const crypto = require('crypto')

class GalleryController {
    async getAll(req, res, next) {
        try {
            const galleries = await HockeyGallery.findAll({
                include: [
                    {
                        model: GalleryImage,
                        as: 'image',
                        where: {
                            isMainImage: true
                        }
                    }
                ]
            })

            return res.json({galleries})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getAllWithImages(req, res, next) {
        try {
            const galleries = await HockeyGallery.findAll({
                include: [
                    {
                        model: GalleryImage,
                        as: 'image'
                    }
                ]
            })

            return res.json({galleries})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getOne(req, res, next) {
        const {id} = req.params

        try {
            const candidate = await HockeyGallery.findByPk(id, {
                include: [
                    {
                        model: GalleryImage,
                        as: 'image'
                    }
                ]
            })
            if (!candidate)
                return next(ErrorHandler.badRequest(`Галлереи с номером ${id} не найдено!`))

            return res.json({candidate})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async create(req, res, next) {
        const {galleryTitle, galleryDescription} = req.body;
        const image = req.files?.image;

        try {
            if (!Validation.isString(galleryTitle))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное название галереи!'));
            if (!Validation.isString(galleryDescription))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное описание галлереи!'));

            const galleryCandidate = await HockeyGallery.findOne({where: {galleryTitle}});
            if (galleryCandidate)
                return next(ErrorHandler.conflict(`Галлерея с названием ${galleryTitle} уже существует!`));

            const gallery = await HockeyGallery.create({
                galleryTitle,
                galleryDescription
            });

            let images = image ? (Array.isArray(image) ? image : [image]) : [];
            let galleryImage = [];
            const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

            for (let img of images) {
                const fileExtension = path.extname(img.name).toLowerCase();
                if (!allowedImageExtensions.includes(fileExtension)) {
                    return next(ErrorHandler.badRequest('Пожалуйста, загрузите изображения в форматах .jpeg, .jpg, .png или .gif!'));
                }

                const fileName = crypto.randomBytes(16).toString('hex') + fileExtension;
                await img.mv(path.resolve(__dirname, '..', 'static', fileName));
                galleryImage.push({imageName: fileName});
            }

            if (galleryImage.length <= 0) {
                return next(ErrorHandler.conflict("Пожалуйста, добавьте хотя бы одно изображение в галлерею!"));
            }

            await Promise.all(galleryImage.map((image, index) =>
                GalleryImage.create({
                    imageName: image.imageName,
                    hockeyGalleryId: gallery.id,
                    isMainImage: index === 0
                })
            ));

            return res.json({gallery});
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`));
        }
    }

    async deleteOne(req, res, next) {
        const {id} = req.query

        try {
            const gallery = await HockeyGallery.findByPk(id)
            if (!gallery)
                return next(ErrorHandler.notFound(`Галлереи под номером ${id} не существует!`))

            const images = await GalleryImage.findAll({
                where: {
                    hockeyGalleryId: gallery.id
                }
            })
            if (images) {
                images.map(async (galleryItem) => {
                    await galleryItem.destroy()
                })
            }

            await gallery.destroy()
            return res.status(200).json({message: `Галерея с номером ${id} успешно удалена!`})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteAll(req, res, next) {
        try {
            const images = await GalleryImage.findAll()
            if (images) {
                images.map(async (galleryItem) => {
                    await galleryItem.destroy()
                })
            }

            const hockeyGallery = await HockeyGallery.findAll()
            if (!hockeyGallery.length)
                return next(ErrorHandler.notFound('Ни одной галлереи не найдено в системе!'))
            hockeyGallery.map(async (hockeyGalleryItem) => {
                await hockeyGalleryItem.destroy()
            })

            await GalleryImage.findAll().then((data) => {
                data.map(async (item) => {
                    await item.destroy()
                })
            })

            return res.status(200).json({message: 'Все галлереи успешно удалены!'})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }
}

module.exports = new GalleryController()