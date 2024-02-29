const ErrorHandler = require("../errors/errorHandler");
const {
    GameMatch,
    HockeyClub, News
} = require("../database");
const Validation = require("../validations/validation");
const {Op} = require("sequelize");

class MatchController {
    async getOne(req, res, next) {
        const {id} = req.query

        try {
            const candidate = await GameMatch.findByPk(id)
            if (!candidate)
                return next(ErrorHandler.notFound(`Матч с номером ${id} не найден!`))
            return res.json({candidate})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getAll(req, res, next) {
        try {
            const matches = await GameMatch.findAll({include: HockeyClub})
            return res.json({matches})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async create(req, res, next) {
        const {
            matchDate,
            matchTime,
            hockeyClubId
        } = req.body
        try {
            if (!(Validation.isDate(matchDate)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректную дату! Формат: YYYY-MM-DD!'))
            if (!(Validation.isTime(matchTime)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное время! Формат: HH:MM:SS!'))

            const zilant = await HockeyClub.findByPk(hockeyClubId)
            if (zilant.clubName === 'ХК <<КАИ-ЗИЛАНТ>>' || !(await HockeyClub.findByPk(hockeyClubId)))
                return next(ErrorHandler.conflict(`Клуб с номером ${hockeyClubId} не найден!`))

            if (new Date(matchDate).toISOString().split('T')[0] < new Date().toISOString().split('T')[0])
                return next(ErrorHandler.conflict('А мы что, в прошлом играть умеем? 🤣'))
            if (new Date(matchDate).toISOString().split('T')[0] === new Date().toISOString().split('T')[0])
                return next(ErrorHandler.conflict('Не издевайтесь над ребятами, они не могут узнавать об игре день в день! 😭'))

            const match = await GameMatch.create({
                matchDate: new Date(matchDate),
                matchTime,
                hockeyClubId
            })

            return res.json({match})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async edit(req, res, next) {
        const {id} = req.query
        const {
            matchDate,
            matchTime,
            hockeyClubId
        } = req.body

        try {
            const candidate = await GameMatch.findByPk(id)
            if (!candidate)
                return next(ErrorHandler.notFound('Данного матча не найдено 🤔'))

            if (!(Validation.isDate(matchDate)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректную дату! Формат: YYYY-MM-DD!'))
            if (!(Validation.isTime(matchTime)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное время! Формат: HH:MM:SS!'))

            const zilant = await HockeyClub.findByPk(hockeyClubId)
            if (zilant.clubName === 'ХК <<КАИ-ЗИЛАНТ>>' || !(await HockeyClub.findByPk(hockeyClubId)))
                return next(ErrorHandler.conflict(`Клуб с номером ${hockeyClubId} не найден!`))

            if (new Date(matchDate).toISOString().split('T')[0] < new Date().toISOString().split('T')[0])
                return next(ErrorHandler.conflict('А мы что, в прошлом играть умеем? 🤣'))
            if (new Date(matchDate).toISOString().split('T')[0] === new Date().toISOString().split('T')[0])
                return next(ErrorHandler.conflict('Не издевайтесь над ребятами, они не могут узнавать об игре день в день! 😭'))
            const existingGameOnDate = await GameMatch.findOne({
                where: {
                    matchDate: new Date(matchDate),
                    id: {[Op.ne]: id}
                }
            });

            if (existingGameOnDate && existingGameOnDate.id !== id) {
                return next(ErrorHandler.forbidden('Две игры в день? Не нужно так делать! 🤬'));
            }

            const candidateToUpdate = {
                matchDate: matchDate || candidate.matchDate,
                matchTime: matchTime || candidate.matchTime,
                hockeyClubId: hockeyClubId || candidate.hockeyClubId
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
            await GameMatch.findByPk(id).then(async (match) => {
                if (!match)
                    return next(ErrorHandler.notFound(`Матч с номером ${id} не найден!`))

                await match.destroy()
                return res.status(200).json({message: `Матч с номером ${id} успешно удален!`})
            })
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteAll(req, res, next) {
        try {
            await GameMatch.findAll().then((match) => {
                if (!match.length)
                    return next(ErrorHandler.notFound('Матчи не найдены!'))

                match.map((item) => {
                    item.destroy()
                })

                return res.status(200).json({message: 'Матчи успешно удалены!'})
            })
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }
}

module.exports = new MatchController()