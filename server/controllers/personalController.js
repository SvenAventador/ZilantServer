const ErrorHandler = require("../errors/errorHandler")
const {User} = require("../database")
const Validation = require("../validations/validation")
const bcrypt = require("bcrypt")

class PersonalController {
    async editData(req, res, next) {
        const {id} = req.params;
        const {
            userName,
            userEmail,
            userPassword,
            userFio,
            userAddress,
            userPhone
        } = req.body;

        try {
            const user = await User.findByPk(id);
            if (!user)
                return next(ErrorHandler.notFound(`Пользователь с идентификатором ${id} не найден!`));

            if (userName && userName !== user.userName && await User.findOne({where: {userName}}))
                return next(ErrorHandler.conflict(`Пользователь с именем ${userName} уже существует!`));

            if (userEmail && userEmail !== user.userEmail && await User.findOne({where: {userEmail}}))
                return next(ErrorHandler.conflict(`Пользователь с почтой ${userEmail} уже существует!`));

            if (userPhone && userPhone !== user.userPhone && await User.findOne({where: {userPhone}}))
                return next(ErrorHandler.conflict(`Пользователь с номером ${userPhone} уже существует!`));

            const userToUpdate = {
                userName: userName || user.userName,
                userEmail: userEmail || user.userEmail,
                userPassword: userPassword ? await bcrypt.hash(userPassword, 5) : user.userPassword,
                userFio: userFio || user.userFio,
                userAddress: userAddress || user.userAddress,
                userPhone: userPhone || user.userPhone,
            };

            await user.update(userToUpdate);
            const token = Validation.generate_jwt(
                user.id,
                user.userName,
                user.userEmail,
                user.userRole,
                user.userFio,
                user.userAddress,
                user.userPhone
            );

            return res.json({token});
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`));
        }
    }
}

module.exports = new PersonalController()