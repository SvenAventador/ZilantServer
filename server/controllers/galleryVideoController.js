const {GalleryVideo, GalleryVideoList} = require("../database");
const ErrorHandler = require("../errors/errorHandler");
const Validation = require("../validations/validation");
const path = require("path");
const uuid = require("uuid");
const crypto = require('crypto')

class GalleryVideoController {
    async getAll(req, res, next) {
        try {
            const galleries = await GalleryVideo.findAll({
                include: [
                    {
                        model: GalleryVideoList,
                        as: 'video'
                    }
                ]
            })
            return res.json({galleries})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getAllWithVideo(req, res, next) {
        try {
            const galleries = await GalleryVideo.findAll({
                include: [
                    {
                        model: GalleryVideoList,
                        as: 'video'
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
            const candidate = await GalleryVideo.findByPk(id, {
                include: [
                    {
                        model: GalleryVideoList,
                        as: 'video'
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
        const { galleryTitle, galleryDescription } = req.body;
        const { galleryImage } = req.files;
        const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        const allowedVideoExtensions = ['.mp4', '.mpeg4', '.mov', '.avi', '.mkv'];
        const video = req.files?.video;

        try {
            if (!Validation.isString(galleryTitle))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное название галереи!'));
            if (!Validation.isString(galleryDescription))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное описание галлереи!'));

            const galleryCandidate = await GalleryVideo.findOne({ where: { galleryTitle } });
            if (galleryCandidate)
                return next(ErrorHandler.conflict(`Галлерея с названием ${galleryTitle} уже существует!`));

            if (!galleryImage)
                return next(ErrorHandler.badRequest('Пожалуйста, выберите изображение!'));

            const fileExtension = path.extname(galleryImage.name).toLowerCase();
            if (!allowedImageExtensions.includes(fileExtension))
                return next(ErrorHandler.badRequest('Пожалуйста, загрузите файл в формате изображения: .jpg, .jpeg, .png или .gif!'));

            const fileName = crypto.randomBytes(16).toString('hex') + fileExtension;
            await galleryImage.mv(path.resolve(__dirname, '..', 'static', fileName));

            const videos = video ? (Array.isArray(video) ? video : [video]) : [];
            let galleryVideo = [];

            for (let vid of videos) {
                const videoExtension = path.extname(vid.name).toLowerCase();
                if (!allowedVideoExtensions.includes(videoExtension)) {
                    return next(ErrorHandler.badRequest('Пожалуйста, загрузите видео в форматах .mp4, .mpeg4, .mov, .mkv или .avi!'));
                }
                const videoFileName = crypto.randomBytes(16).toString('hex') + videoExtension;
                await vid.mv(path.resolve(__dirname, '..', 'static', videoFileName));
                galleryVideo.push({ videoName: videoFileName });
            }

            if (galleryVideo.length <= 0) {
                return next(ErrorHandler.badRequest('Пожалуйста, выберите хотя бы одно видео!'))
            }

            const gallery = await GalleryVideo.create({
                galleryTitle,
                galleryDescription,
                galleryImage: fileName
            });

            if (galleryVideo.length > 0) {
                await Promise.all(galleryVideo.map((video, index) =>
                    GalleryVideoList.create({
                        videoName: video.videoName,
                        galleryVideoId: gallery.id,
                        isMainVideo: index === 0
                    })
                ));
            }

            return res.json({ gallery });
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`));
        }
    }

    async deleteOne(req, res, next) {
        const {id} = req.query
        try {
            const gallery = await GalleryVideo.findByPk(id)
            if (!gallery)
                return next(ErrorHandler.notFound(`Галлереи под номером ${id} не существует!`))
            const video = await GalleryVideoList.findAll({
                where: {
                    galleryVideoId: gallery.id
                }
            })
            if (video) {
                video.map(async (galleryItem) => {
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
            const video = await GalleryVideoList.findAll()
            if (video) {
                video.map(async (galleryItem) => {
                    await galleryItem.destroy()
                })
            }
            const hockeyGallery = await GalleryVideo.findAll()
            if (!hockeyGallery.length)
                return next(ErrorHandler.notFound('Ни одной галлереи не найдено в системе!'))
            hockeyGallery.map(async (hockeyGalleryItem) => {
                await hockeyGalleryItem.destroy()
            })
            await GalleryVideoList.findAll().then((data) => {
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

module.exports = new GalleryVideoController()