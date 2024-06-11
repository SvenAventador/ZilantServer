const {Cart, MerchandiseCart, Merchandise} = require("../database");
const ErrorHandler = require("../errors/errorHandler");

class CartController {
    async getCartId(req, res, next) {
        try {
            const {id} = req.params

            const cart = await Cart.findOne({where: {userId: id}})
            return res.json(cart)
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getAllGood(req, res, next) {
        try {
            const {id} = req.params

            const cartDevices = await MerchandiseCart.findAll({
                where: {cartId: id},
                include: [
                    {
                        model: Merchandise,
                        as: 'merchandise',
                    },
                ],
            });

            // Extract the merchandise items
            const merchandiseItems = cartDevices.map(cartDevice => cartDevice.merchandise);

            return res.json(merchandiseItems);
        } catch {
            return next(ErrorHandler.internal("Произошла ошибка во время выполнения запроса!"))
        }
    }

    async createMerchandise(req, res, next) {
        const {
            cartId,
            merchandiseId
        } = req.body()

        try {
            const candidate = await MerchandiseCart.findOne({
                where: {
                    cartId,
                    merchandiseId
                }
            })

            const merchandise = await Merchandise.findOne({where: {id: merchandiseId}})

            if (candidate) {
                if (merchandise.merchandiseAmount < candidate.count )
                    return next(ErrorHandler.conflict('Товаров-то нет :|'))

                await candidate.update({count: candidate.count + 1})
                return res.json({message: "Товар обновил свое количество!"})
            }

            await MerchandiseCart.create({cartId, merchandiseId})
            return res.json({message: "Товар успешно добавлен в коризну"})
        } catch (error) {
            return next(ErrorHandler.internal("Произошла ошибка во время выполнения запроса!"))
        }
    }

    async deleteItem(req, res, next) {

    }

    async deleteAll(req, res, next) {

    }

    async updateAmountDevice(req, res, next) {
        const {id, deviceAmount} = req.body

        try {
            const deviceCandidate = await Device.findOne({where: {id: id}})
            const cartDevice = await CartDevice.findOne({where: {deviceId: id}})
            if (!cartDevice) {
                return next(ErrorHandler.badRequest('Данной записи не найдено!'))
            }
            if (deviceCandidate.deviceCount < deviceAmount) {
                return next(ErrorHandler.conflict('Данного товара больше нет на складе!'))
            }

            await cartDevice.update({amountDevice: deviceAmount})

            return res.json({message: "Количество успешно обновлено!" + "Количество: ", deviceAmount})
        } catch {
            return next(ErrorHandler.internal("Произошла ошибка во время выполнения запроса!"))
        }
    }

}

module.exports = new CartController();