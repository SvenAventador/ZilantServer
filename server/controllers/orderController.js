const ErrorHandler = require("../errors/errorHandler");
const {
    Cart,
    Order,
    MerchandiseCart,
    MerchandiseOrder,
    Merchandise, User
} = require("../database");
const {Op} = require("sequelize");
const {sendEmailWithImages} = require("../validations/func");
const path = require("node:path");

class OrderController {
    async getAllUserOrders(req, res, next) {

    }

    async getAllOrders(req, res, next) {
        try {
            const user = await User.findAll({
                where: {
                    id: {
                        [Op.ne]: 1
                    }
                },
                include: {
                    model: Order,
                    include: [
                        {
                            model: MerchandiseOrder,
                            include: [Merchandise],
                            required: true
                        }
                    ]
                }
            })
            return res.json(user)
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async changeDeliveryStatus(req, res, next) {
        const { orderId, deliveryStatusId } = req.query;

        try {
            const order = await Order.findByPk(orderId, {
                include: [
                    {
                        model: MerchandiseOrder,
                        include: [Merchandise]
                    },
                    User
                ]
            });

            order.deliveryStatusId = deliveryStatusId;
            await order.save();

            if (+order.deliveryStatusId === 5) {
                const user = order.user;
                const merchandiseList = order.merchandise_orders.map(mo => mo.merchandise);
                const imagePaths = merchandiseList.map(item => path.join(__dirname, '..', 'static', item.merchandiseImage));

                await sendEmailWithImages(imagePaths, merchandiseList, user.userEmail, user.userName, order.fullPrice);
            }

            return res.json({ message: "Статус успешно изменен!" });
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`));
        }
    }

    async createOrder(req, res, next) {
        const {id} = req.params;
        const {fullPrice} = req.body;
        try {
            const cart = await Cart.findByPk(id, {
                include: {
                    model: MerchandiseCart
                }
            })
            const order = await Order.create({
                dateOrder: Date.now(),
                deliveryStatusId: 1,
                paymentStatusId: 1,
                userId: cart.userId,
                fullPrice: fullPrice
            })

            const merchandiseCarts = cart.merchandise_carts;
            for (const merch of merchandiseCarts) {
                await MerchandiseOrder.create({
                    orderId: order.id,
                    merchandiseId: merch.merchandiseId
                })

                const merchandise = await Merchandise.findByPk(merch.merchandiseId);
                if (merchandise) {
                    merchandise.merchandiseAmount -= merch.count;
                    await merchandise.save();
                }
            }

            const cart_merchandise = await MerchandiseCart.findAll()
            cart_merchandise.map(async (item) => {
                await item.destroy()
            })
            return res.status(201).json({message: "Заказ успешно создан!"});
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }
}

module.exports = new OrderController();