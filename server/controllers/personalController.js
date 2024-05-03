const ErrorHandler = require("../errors/errorHandler")
const {User} = require("../database")
const Validation = require("../validations/validation")
const bcrypt = require("bcrypt")

class PersonalController {
    async editData(req, res, next) {
        const {id} = req.params
        const {
            userName,
            userEmail,
            userPassword,
            userFio,
            userAddress,
            userPhone
        } = req.body

        try {
            const user = await User.findByPk(id)
            if (!user)
                return next(ErrorHandler.notFound(`Пользователь с идентификатором ${id} не найден!`))

            if (userName && !(Validation.isString(userName)))
                return next(ErrorHandler.badRequest('Пожалуйста, задайте корректное имя!'))

            if (userEmail && (!(Validation.isString(userEmail)) || !(Validation.isEmail(userEmail))))
                return next(ErrorHandler.badRequest('Пожалуйста, задайте корректную почту!'))

            if (userPassword && (!(Validation.isString(userPassword)) || !(Validation.isPassword(userPassword))))
                return next(ErrorHandler.badRequest('Пожалуйста, задайте корректный пароль! Минимальная длина пароля 8 символов!'))

            if (userFio && (!(Validation.isString(userFio)) || userFio.split(' ').length < 2))
                return next(ErrorHandler.badRequest('Пожалуйста, задайте корректное ФИО. При необходимости, отчество можно опустить!'))

            if (userAddress && !(Validation.isString(userAddress)))
                return next(ErrorHandler.badRequest('Пожалуйста, задайте корректный адрес проживания!'))

            if (userPhone && (!(Validation.isString(userPhone)) || !(Validation.isPhone(userPhone))))
                return next(ErrorHandler.badRequest('Пожалуйста, задайте корректный номер телефона!'))

            if (userName && userName !== user.userName && await User.findOne({where: {userName}}))
                return next(ErrorHandler.conflict(`Пользователь с именем ${userName} уже существует!`))

            if (userEmail && userEmail !== user.userEmail && await User.findOne({where: {userEmail}}))
                return next(ErrorHandler.conflict(`Пользователь с почтой ${userEmail} уже существует!`))

            if (userPhone && userPhone !== user.userPhone && await User.findOne({where: {userPhone}}))
                return next(ErrorHandler.conflict(`Пользователь с номером ${userPhone} уже существует!`))

            const userToUpdate = {
                userName: userName || user.userName,
                userEmail: userEmail || user.userEmail,
                userPassword: await bcrypt.hash(userPassword, 5) || user.userPassword,
                userFio: userFio || user.userFio,
                userAddress: userAddress || user.userAddress,
                userPhone: userPhone || user.userPhone,
            }

            await user.update(userToUpdate)
            const token = Validation.generate_jwt(
                user.id,
                user.userName,
                user.userEmail,
                user.userRole,
                user.userFio,
                user.userAddress,
                user.userPhone
            )

            return res.json({token})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }
}

module.exports = new PersonalController()