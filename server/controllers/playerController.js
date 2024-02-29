const ErrorHandler = require("../errors/errorHandler");
const Validation = require("../validations/validation");
const {ClubPlayer} = require("../database");
const path = require("path");
const uuid = require("uuid");
const {Op} = require("sequelize");

class PlayerController {
    async getOne(req, res, next) {
        const {id} = req.query
        try {
            const candidate = await ClubPlayer.findByPk(id)
            if (!candidate)
                return next(ErrorHandler.notFound('Игрок не найден...'))

            return res.json({candidate})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getAll(req, res, next) {
        try {
            const players = await ClubPlayer.findAll()
            return res.json({players})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async create(req, res, next) {
        const {
            playerSurname,
            playerName,
            playerPatronymic,
            playerNumber,
            playerPosition
        } = req.body
        const {playerImage} = req.files || {}
        const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        const validEnum = [
            'Вратарь',
            'Защитник',
            'Нападающий'
        ]

        try {
            if (!(Validation.isString(playerSurname)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректную фамилию!'))
            if (!(Validation.isString(playerName)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное имя!'))
            if (playerPatronymic && !(Validation.isString(playerPatronymic)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное отчество!'))
            if (!(Validation.isNumber(+playerNumber)) || playerNumber < 1 || playerNumber > 99)
                return next(ErrorHandler.badRequest('Правила хоккея не изменили. Номер игрока должен быть от 1 до 99!'));
            if (validEnum.indexOf(playerPosition) === -1)
                return next(ErrorHandler.badRequest('Не вратарь, не защитник, не нападающий. Кто этот воин?'));

            if (playerImage === undefined)
                return next(ErrorHandler.badRequest('Пожалуйста, выберите изображение!'))
            const fileExtension = path.extname(playerImage.name).toLowerCase()
            if (!allowedImageExtensions.includes(fileExtension))
                return next(ErrorHandler.badRequest('Пожалуйста, загрузите файл в формате изображения: jpg, jpeg, png или gif!'))

            const candidate = await ClubPlayer.findOne({where: {playerNumber}})
            if (candidate)
                return next(ErrorHandler.conflict('Так быть не должно. Один номер на одного игрока!'))

            let fileName = uuid.v4() + ".jpg"
            await playerImage.mv(path.resolve(__dirname, '..', 'static', fileName))

            const player = await ClubPlayer.create({
                playerSurname,
                playerName,
                playerPatronymic,
                playerNumber,
                playerPosition,
                playerImage: fileName
            })

            return res.json({player})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async edit(req, res, next) {
        const {id} = req.query
        const {
            playerSurname,
            playerName,
            playerPatronymic,
            playerNumber,
            playerPosition
        } = req.body
        const validEnum = [
            'Вратарь',
            'Защитник',
            'Нападающий'
        ]
        let playerImageFileName = null;
        if (req.files && req.files.merchandiseImage) {
            const playerImage = req.files.merchandiseImage;
            const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
            const fileExtension = path.extname(playerImage.name).toLowerCase();

            if (!allowedImageExtensions.includes(fileExtension))
                return next(ErrorHandler.badRequest('Пожалуйста, загрузите файл в формате изображения: jpg, jpeg, png или gif!'));

            playerImageFileName = uuid.v4() + fileExtension;

            try {
                await playerImage.mv(path.resolve(__dirname, '..', 'static', playerImageFileName));
            } catch (error) {
                return next(ErrorHandler.internal(`Ошибка при сохранении изображения: ${error}`));
            }
        }

        try {
            if (!(Validation.isString(playerSurname)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректную фамилию!'))
            if (!(Validation.isString(playerName)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное имя!'))
            if (playerPatronymic && !(Validation.isString(playerPatronymic)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное отчество!'))
            if (!(Validation.isNumber(+playerNumber)) || playerNumber < 1 || playerNumber > 99)
                return next(ErrorHandler.badRequest('Правила хоккея не изменили. Номер игрока должен быть от 1 до 99!'));
            if (validEnum.indexOf(playerPosition) === -1)
                return next(ErrorHandler.badRequest('Не вратарь, не защитник, не нападающий. Кто этот воин?'));

            const candidate = await ClubPlayer.findByPk(id)
            if (!candidate)
                return next(ErrorHandler.notFound('Игрок не найден...'))

            const existingPlayerNumber = await ClubPlayer.findOne({
                where: {
                    playerNumber: playerNumber,
                    id: {[Op.ne]: id}
                }
            });
            if (existingPlayerNumber && existingPlayerNumber.id !== id) {
                return next(ErrorHandler.forbidden('Так быть не должно. Один номер на одного игрока!'));
            }

            const candidateToUpdate = {
                playerSurname: playerSurname || candidate.playerSurname,
                playerName: playerName || candidate.playerName,
                playerPatronymic: playerPatronymic || candidate.playerPatronymic,
                playerNumber: playerNumber || candidate.playerNumber,
                playerPosition: playerPosition || candidate.playerPosition,
                playerImage: playerImageFileName ? playerImageFileName : candidate.playerImage
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
            await ClubPlayer.findByPk(id).then(async (data) => {
                if (!data)
                    return next(ErrorHandler.notFound('Игрок не найден!'))
                await data.destroy()
                return res.status(200).json({message: 'Игрок успешно удален!'})
            })
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteAll(req, res, next) {
        try {
            await ClubPlayer.findAll().then((data) => {
                if (!data.length)
                    return next(ErrorHandler.notFound('Игроки не найдены!'))

                data.map(async (item) => {
                    await item.destroy()
                })

                return res.status(200).json({message: 'Игроки успешно удалены!'})
            })
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }
}

module.exports = new PlayerController()