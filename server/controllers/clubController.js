const ErrorHandler = require("../errors/errorHandler")
const {HockeyClub, GameMatch} = require("../database")
const Validation = require("../validations/validation")
const path = require("path")
const uuid = require("uuid")
const {Sequelize} = require("sequelize");

class ClubController {
    async getOne(req, res, next) {
        const {id} = req.query

        try {
            const club = await HockeyClub.findByPk(id)
            if (!club)
                return next(ErrorHandler.notFound(`Клуб с номером ${id} не найден!`))

            return res.json({club})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getAll(req, res, next) {
        try {
            const clubs = await HockeyClub.findAll({
                order: [
                    ['clubPoint', 'desc']
                ]
            })

            return res.json({clubs})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async create(req, res, next) {
        const {
            clubName
        } = req.body

        const {clubImage} = req.files || {}
        const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

        try {
            if (!(Validation.isString(clubName)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное название клуба!'))

            if (clubImage === undefined)
                return next(ErrorHandler.badRequest('Пожалуйста, выберите изображение!'))
            const fileExtension = path.extname(clubImage.name).toLowerCase()
            if (!allowedImageExtensions.includes(fileExtension))
                return next(ErrorHandler.badRequest('Пожалуйста, загрузите файл в формате изображения: .jpg, .jpeg, .png или .gif!'))

            const clubCandidate = await HockeyClub.findOne({where: {clubName}})
            if (clubCandidate)
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
        } = req.body

        let clubImageFileName = null;
        if (req.files && req.files.clubImage) {
            const clubImage = req.files.clubImage;
            const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
            const fileExtension = path.extname(clubImage.name).toLowerCase();
            if (!allowedImageExtensions.includes(fileExtension))
                return next(ErrorHandler.badRequest('Пожалуйста, загрузите файл в формате изображения: .jpg, .jpeg, .png или .gif!'));
            clubImageFileName = uuid.v4() + fileExtension;
            try {
                await clubImage.mv(path.resolve(__dirname, '..', 'static', clubImageFileName));
            } catch (error) {
                return next(ErrorHandler.internal(`Ошибка при сохранении изображения: ${error}`));
            }
        }

        try {
            if (!(Validation.isString(clubName)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное название клуба!'))

            const currentClub = await HockeyClub.findByPk(id)
            if (!currentClub)
                return next(ErrorHandler.conflict(`Клуба с идентификатором ${id} не найдено!`))

            if (clubName !== currentClub.clubName && await HockeyClub.findOne({where: {clubName}}))
                return next(ErrorHandler.conflict(`Клуб с названием '${clubName}' уже существует!`))
            console.log(clubImageFileName, currentClub.clubImage)
            const updateClub = {
                clubName: clubName || currentClub.clubName,
                clubImage: clubImageFileName ? clubImageFileName : currentClub.clubImage
            }

            await currentClub.update(updateClub)
            return res.json({currentClub})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteOne(req, res, next) {
        const {id} = req.query

        try {
            const currentClub = await HockeyClub.findByPk(id)
            if (!currentClub)
                return next(ErrorHandler.notFound(`Клуб с идентификатором ${id} не существует!`))

            if (currentClub.clubName === 'ХК <<КАИ-ЗИЛАНТ>>')
                return next(ErrorHandler.conflict('Вы не можете удалить свою же команду. Решение об исключении команды из СХЛ приинимает высшее руководство!'))


            const matches = await GameMatch.findAll({where: {hockeyClubId: id}})
            matches.map(async (match) => {
                await match.destroy()
            })

            await currentClub.destroy()
            return res.status(200).json({message: `Клуб с номером ${id} успешно удален!`})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteAll(req, res, next) {
        try {
            const clubs = await HockeyClub.findAll()

            const matches = await GameMatch.findAll()
            matches.map(async (match) => {
                await match.destroy()
            })

            clubs.map(async (currentClub) => {
                if (currentClub.clubName !== 'ХК <<КАИ-ЗИЛАНТ>>')
                    await currentClub.destroy()
            })

            return res.status(200).json({message: 'Клубы успешно удалены!'})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }
}

module.exports = new ClubController()