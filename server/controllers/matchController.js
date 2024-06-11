const ErrorHandler = require("../errors/errorHandler")
const {
    GameMatch,
    HockeyClub
} = require("../database")
const {Op} = require("sequelize")

class MatchController {
    async getOne(req, res, next) {
        const {id} = req.query

        try {
            const match = await GameMatch.findByPk(id)
            if (!match)
                return next(ErrorHandler.notFound(`Матч с номером ${id} не найден!`))

            return res.json({match})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getAll(req, res, next) {
        try {
            const matches = await GameMatch.findAll({
                include: HockeyClub
            })

            return res.json({matches})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async create(req, res, next) {
        const {
            matchDate,
            matchTime,
            icePlace,
            hockeyClubId
        } = req.body

        try {
            const currentClub = await HockeyClub.findByPk(hockeyClubId)
            if (currentClub?.clubName === 'ХК <<КАИ-ЗИЛАНТ>>' || !(await HockeyClub.findByPk(hockeyClubId)))
                return next(ErrorHandler.conflict(`Клуб с номером ${hockeyClubId} не найден!`))

            if (new Date(matchDate).toISOString().split('T')[0] < new Date().toISOString().split('T')[0])
                return next(ErrorHandler.conflict('А мы что, в прошлом играть умеем? 🤣'))
            if (new Date(matchDate).toISOString().split('T')[0] === new Date().toISOString().split('T')[0])
                return next(ErrorHandler.conflict('Не издевайтесь над ребятами, они не могут узнавать об игре день в день! 😭'))

            const match = await GameMatch.create({
                matchDate: new Date(matchDate),
                icePlace,
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
            gameScore,
            hockeyClubId
        } = req.body

        try {
            const currentMatch = await GameMatch.findByPk(id)
            if (!currentMatch)
                return next(ErrorHandler.notFound('Данного матча не найдено 🤔'))

            if (new Date(currentMatch.matchDate) >= new Date())
                return next(ErrorHandler.conflict('Матч еще не прошел!!'))

            const zilantClub = await HockeyClub.findByPk(1)
            const otherHC = await HockeyClub.findByPk(hockeyClubId)
            const [zilant, otherClub] = gameScore.split(':')

            if (currentMatch.gameScore !== null)
                return next(ErrorHandler.badRequest('В данном матче уже установлен счет!'))

            if (zilant.includes('О') || zilant.includes('Б')) {
                zilantClub.clubPoint += 2
                otherHC.clubPoint += 1
            }

            if (otherClub.includes('О') || otherClub.includes('Б')) {
                zilantClub.clubPoint += 1
                otherHC.clubPoint += 2
            }

            if (parseInt(zilant) > parseInt(otherClub)) {
                zilantClub.clubPoint += 3
                otherHC.clubPoint += 0
            }

            if (parseInt(zilant) < parseInt(otherClub)) {
                zilantClub.clubPoint += 0
                otherHC.clubPoint += 3
            }

            await zilantClub.save()
            await otherHC.save()

            await currentMatch.update({
                gameScore
            })
            return res.json({message: "Результат матча успешно сохранен!"})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteOne(req, res, next) {
        const {id} = req.query

        try {
            const match = await GameMatch.findByPk(id)
            if (!match)
                return next(ErrorHandler.notFound(`Матч с номером ${id} не найден!`))

            await match.destroy()
            return res.status(200).json({message: `Матч с номером ${id} успешно удален!`})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteAll(req, res, next) {
        try {
            const matches = await GameMatch.findAll()
            matches.map(async (item) => {
                await item.destroy()
            })

            return res.status(200).json({message: 'Матчи успешно удалены!'})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }
}

module.exports = new MatchController()