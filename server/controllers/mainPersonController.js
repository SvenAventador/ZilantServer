const ErrorHandler = require("../errors/errorHandler")
const Validation = require("../validations/validation")
const {MainPerson} = require("../database")
const path = require("path")
const uuid = require("uuid")
const {Op} = require("sequelize")

class PlayerController {
    async getOne(req, res, next) {
        const {id} = req.query

        try {
            const candidate = await MainPerson.findByPk(id)
            if (!candidate)
                return next(ErrorHandler.notFound(`Руководитель под номеорм ${id} не найден!`))

            return res.json({candidate})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getAll(req, res, next) {
        try {
            const persons = await MainPerson.findAll()
            return res.json({persons})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async create(req, res, next) {
        const {
            personSurname,
            personName,
            personPatronymic,
            personPosition
        } = req.body
        const {personImage} = req.files || {}
        const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif']

        try {
            if (!(Validation.isString(personSurname)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректную фамилию!'))
            if (!(Validation.isString(personName)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное имя!'))
            if (personPatronymic && !(Validation.isString(personPatronymic)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное отчество!'))

            if (personImage === undefined)
                return next(ErrorHandler.badRequest('Пожалуйста, выберите изображение!'))
            const fileExtension = path.extname(personImage.name).toLowerCase()
            if (!allowedImageExtensions.includes(fileExtension))
                return next(ErrorHandler.badRequest('Пожалуйста, загрузите файл в формате изображения: .jpg, .jpeg, .png или .gif!'))

            let fileName = uuid.v4() + ".jpg"
            await personImage.mv(path.resolve(__dirname, '..', 'static', fileName))

            const person = await MainPerson.create({
                personSurname,
                personName,
                personPatronymic,
                personPosition,
                personImage: fileName
            })

            return res.json({person})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async edit(req, res, next) {
        const {id} = req.query
        const {
            personSurname,
            personName,
            personPatronymic,
            personPosition
        } = req.body

        let personImageFileName = null;
        if (req.files && req.files.personImage) {
            const personImage = req.files.personImage
            const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif']
            const fileExtension = path.extname(personImage.name).toLowerCase()

            if (!allowedImageExtensions.includes(fileExtension))
                return next(ErrorHandler.badRequest('Пожалуйста, загрузите файл в формате изображения: .jpg, .jpeg, .png или .gif!'))

            personImageFileName = uuid.v4() + fileExtension

            try {
                await personImage.mv(path.resolve(__dirname, '..', 'static', personImageFileName))
            } catch (error) {
                return next(ErrorHandler.internal(`Ошибка при сохранении изображения: ${error}`))
            }
        }

        try {
            if (!(Validation.isString(personSurname)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректную фамилию!'))
            if (!(Validation.isString(personName)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное имя!'))
            if (personPatronymic && !(Validation.isString(personPatronymic)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное отчество!'))

            const person = await MainPerson.findByPk(id)
            if (!person)
                return next(ErrorHandler.notFound(`herjdoljjbntk под номером ${id} не найден!`))

            const updatePlayer = {
                personSurname: personSurname || person.personSurname,
                personName: personName || person.personName,
                personPosition: personPosition || person.personPosition,
                playerImage: personImageFileName ? personImageFileName : person.playerImage
            }

            await person.update(updatePlayer)
            return res.json({updatePlayer})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteOne(req, res, next) {
        const {id} = req.query

        try {
            const person = await MainPerson.findByPk(id)
            if (!person)
                return next(ErrorHandler.notFound(`Рукрводтель под номером ${id} не найден!`))

            await person.destroy()
            return res.status(200).json({message: 'Руководиетль успешно удален!'})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteAll(req, res, next) {
        try {
            const persons = await MainPerson.findAll()
            persons.map(async (player) => {
                await player.destroy()
            })

            return res.status(200).json({message: 'Руковоидтели успешно удалены!'})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }
}

module.exports = new PlayerController()