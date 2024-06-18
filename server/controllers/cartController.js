const {
    Cart,
    MerchandiseCart,
    Merchandise
} = require("../database");
const ErrorHandler = require("../errors/errorHandler");

class CartController {
    async getOne(req, res, next) {
        const {id} = req.query

        try {
            const cart = await Cart.findByPk(id)
            return res.json(cart.dataValues.id)
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getAllGoods(req, res, next) {
        const {id} = req.params

        try {
            const cart_merchandise = await MerchandiseCart.findAll({where: {cartId: id}})
            const merchandiseId = cart_merchandise.map((item) => item.merchandiseId)

            let merchandise = []
            for (let i = 0; i < merchandiseId.length; i++) {
                const merch = await Merchandise.findByPk(merchandiseId[i])
                merchandise.push(merch.dataValues)
            }

            return res.json(merchandise)
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async createGood(req, res, next) {
        const {id} = req.params
        const {merchandiseId} = req.query
        try {
            const cart_merchandise = await MerchandiseCart.findOne({
                where: {
                    cartId: id,
                    merchandiseId: merchandiseId
                }
            })

            const merchandise = await Merchandise.findByPk(merchandiseId)
            if (cart_merchandise) {
                if (merchandise.amount < cart_merchandise.count)
                    return res.json(ErrorHandler.conflict('Данного товара больше нет на складе!'))

                await cart_merchandise.update({
                    count: cart_merchandise.count + 1
                })
                return res.json({message: "Товар успешно обновил свое количество в коризне!"})
            }

            await MerchandiseCart.create({
                cartId: id,
                merchandiseId: merchandiseId
            })

            return res.json({message: "Товар успешно добавлен в корзину!"})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async updateAmountGood(req, res, next) {
        const {id} = req.params
        const {merchandiseId} = req.query
        const {count} = req.body
        console.log(count)
        try {
            const merchandise = await Merchandise.findByPk(merchandiseId)
            const cart_merchandise = await MerchandiseCart.findOne({
                where: {
                    cartId: id,
                    merchandiseId: merchandiseId
                }
            })

            if (cart_merchandise) {
                if (merchandise.amount < count)
                    return res.json(ErrorHandler.conflict('Данного товара больше нет на складе!'))

                await cart_merchandise.update({
                    count: count
                })
                return res.json({message: "товар успешно обновил свое количество в коризне!"})
            }

            return res.json({message: "Что-то пошло не так!"})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteGood(req, res, next) {
        const {id} = req.params
        const {merchandiseId} = req.query

        try {
            const cart_merchandise = await MerchandiseCart.findOne({
                where: {
                    cartId: id,
                    merchandiseId: merchandiseId
                }
            })

            await cart_merchandise.destroy()
            return res.status(200).json({message: "Товар успешно удален из корзины!"})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteAllGood(req, res, next) {
        const {id} = req.params

        try {
            const cart_merchandise = await MerchandiseCart.findAll({
                where: {
                    cartId: id
                }
            })

            cart_merchandise.map(async (cart) => {
                await cart.destroy()
            })
            return res.status(200).json({message: "Товары успешно удален из корзины!"})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }
}

module.exports = new CartController();