const ErrorHandler = require("../errors/errorHandler");
const {
    History,
    HistoryChapter
} = require("../database");

class HistoryController {
    async getOne(req, res, next) {
        const {id} = req.query

        try {
            const history = await History.findByPk(id, {
                include: [HistoryChapter]
            })
            return res.json(history)
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getAll(req, res, next) {
        try {
            const histories = await History.findAll({
                include: [{
                    model: HistoryChapter,
                    order: [['id', 'ASC']]
                }],
                order: [['id', 'ASC']]
            });
            return res.json(histories);
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`));
        }
    }

    async create(req, res, next) {
        const {historyTitle, historyChapter} = req.body

        try {
            const existingTitle = await History.findOne({where: {historyTitle}})
            if (existingTitle)
                return next(ErrorHandler.conflict('Данный раздел уже существует!'))

            const history = await History.create({historyTitle})

            if (historyChapter !== undefined && historyChapter !== null && historyChapter.length > 0) {
                if (Array.isArray(historyChapter)) {
                    const chapters = historyChapter.map((chapter) => ({
                        historyChapter: chapter,
                        historyId: history.id
                    }))
                    await HistoryChapter.bulkCreate(chapters)
                } else {
                    await HistoryChapter.create({
                        historyChapter: historyChapter,
                        historyId: history.id
                    })
                }
            }

            return res.status(200).json({message: "Записи успешно добавлены!"})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async createChapters(req, res, next) {
        const {id} = req.query
        const {historyChapter} = req.body

        try {
            const history  = await History.findByPk(id)
            if (historyChapter !== undefined && historyChapter !== null && historyChapter.length > 0) {
                if (Array.isArray(historyChapter)) {
                    const chapters = historyChapter.map((chapter) => ({
                        historyChapter: chapter,
                        historyId: history.id
                    }))
                    await HistoryChapter.bulkCreate(chapters)
                } else {
                    await HistoryChapter.create({
                        historyChapter: historyChapter,
                        historyId: history.id
                    })
                }
            }

            return res.status(200).json({message: "Записи успешно добавлены!"})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async updateTitle(req, res, next) {
        const {id} = req.query
        const {historyTitle} = req.body

        try {
            const history = await History.findByPk(id)
            if (historyTitle !== history.historyTitle && await History.findOne({where: {historyTitle}}))
                return next(ErrorHandler.conflict(`Раздел с названием '${historyTitle}' уже существует!`))

            await history.update({
                historyTitle: historyTitle
            })
            return res.status(200).json({message: "Запись успешно обновлена!"})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async updateChapter(req, res, next) {
        const {id} = req.query
        const {historyChapter} = req.body

        try {
            const chapter = await HistoryChapter.findByPk(id)
            await chapter.update({
                historyChapter: historyChapter
            })
            return res.status(200).json({message: "Запись успешно обновлена!"})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteOneTitle(req, res, next) {
        const {id} = req.query
        try {
            const history = await History.findByPk(id)
            const chapters = await HistoryChapter.findAll({where: {historyId: history.id}})
            chapters.map(async (chapter) => {
                await chapter.destroy()
            })
            await history.destroy()
            return res.status(200).json({message: "Запись успешно удалена!"})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteAllTitle(req, res, next) {
        try {
            const history = await History.findAll()
            const chapters = await HistoryChapter.findAll()
            chapters.map(async (chapter) => {
                await chapter.destroy()
            })
            history.map(async (history) => {
                await history.destroy()
            })
            return res.status(200).json({message: "Записи успешно удалены!"})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteOneChapter(req, res, next) {
        const {id} = req.query

        try {
            const chapter = await HistoryChapter.findByPk(id)
            await chapter.destroy()
            return res.status(200).json({message: "Запись успешно удалена!"})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }
}

module.exports = new HistoryController()