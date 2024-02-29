const ErrorHandler = require("../errors/errorHandler");
const {HockeyClub} = require("../database");
const Validation = require("../validations/validation");
const path = require("path");
const uuid = require("uuid");

class ClubController {
    async getOne(req, res, next) {
        const {id} = req.query
        try {
            const candidate = await HockeyClub.findByPk(id)
            if (!candidate)
                return next(ErrorHandler.notFound(`Клуб с номером ${id} не найден!`))

            return res.json({candidate})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getAll(req, res, next) {
        try {
            const clubs = await HockeyClub.findAll({order: [['clubPoint', 'desc']]})
            return res.json({clubs})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async create(req, res, next) {
        const {
            clubName
        } = req.body

        const {clubImage} = req.files
        const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

        try {
            if (!(Validation.isString(clubName)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректный заголовок для новости!'))

            if (clubImage === undefined)
                return next(ErrorHandler.badRequest('Пожалуйста, выберите изображение!'))
            const fileExtension = path.extname(clubImage.name).toLowerCase()
            if (!allowedImageExtensions.includes(fileExtension))
                return next(ErrorHandler.badRequest('Пожалуйста, загрузите файл в формате изображения: jpg, jpeg, png или gif!'))

            const candidate = await HockeyClub.findOne({where: {clubName}})
            if (candidate)
                return next(ErrorHandler.conflict(`Клуб с названием ${clubName} уже существует!`))

            let fileName = uuid.v4() + ".jpg"
            await clubImage.mv(path.resolve(__dirname, '..', 'static', fileName))

            const club = await HockeyClub.create({
                clubName,
                clubImage: fileName
            })

            return res.json({club})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async edit(req, res, next) {
        const {id} = req.query
        const {
            clubName,
            clubPoint
        } = req.body

        let clubImageFileName = null;
        if (req.files && req.files.newsImage) {
            const clubImage = req.files.newsImage;
            const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
            const fileExtension = path.extname(clubImage.name).toLowerCase();

            if (!allowedImageExtensions.includes(fileExtension))
                return next(ErrorHandler.badRequest('Пожалуйста, загрузите файл в формате изображения: jpg, jpeg, png или gif!'));

            clubImageFileName = uuid.v4() + fileExtension;

            try {
                await clubImage.mv(path.resolve(__dirname, '..', 'static', clubImageFileName));
            } catch (error) {
                return next(ErrorHandler.internal(`Ошибка при сохранении изображения: ${error}`));
            }
        }

        try {
            if (!(Validation.isString(clubName)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректный заголовок для новости!'))
            if (!(Validation.isNumber(clubPoint)) && clubPoint < 0)
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное количество очков!'))

            const candidate = await HockeyClub.findByPk(id)
            if (!candidate)
                return next(ErrorHandler.conflict(`Клуба с идентификатором ${id} не найдено!`))

            if (clubName !== candidate.clubName && await HockeyClub.findOne({where: {clubName}}))
                return next(ErrorHandler.conflict(`Клуб с названием '${clubName}' уже существует!`))

            const candidateToUpdate = {
                clubName: clubName || candidate.clubName,
                clubPoint: clubPoint || candidate.clubPoint,
                clubImage: clubImageFileName ? clubImageFileName : candidate.clubName
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
            await HockeyClub.findByPk(id).then(async (club) => {
                if (!club)
                    return next(ErrorHandler.notFound(`Клуб с номером ${id} не найден!`))

                await club.destroy()
                return res.status(200).json({message: `Клуб с номером ${id} успешно удален!`})
            })
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteAll(req, res, next) {
        try {
            await HockeyClub.findAll().then((clubs) => {
                if (!clubs.length)
                    return next(ErrorHandler.notFound('Клубы не найдены!'))

                clubs.map((item) => {
                    item.destroy()
                })

                return res.status(200).json({message: 'Клубы успешно удалены!'})
            })
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }
}

module.exports = new ClubController()