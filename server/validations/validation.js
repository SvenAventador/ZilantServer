const jwt = require('jsonwebtoken')

class Validation {
    static isString(value) {
        return typeof value === "string"
    }

    static isEmpty(value) {
        return value.trim() === ''
    }

    static isObject(value) {
        return typeof value === "object"
    }

    static isEmptyObject(value) {
        return !Object.keys(value).length
    }

    static isNumber(value) {
        return typeof value === "number"
    }

    static isEmail(value) {
        const regex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu
        return regex.test(value)
    }

    static isPassword(value) {
        return value.length >= 8
    }

    static isPhone(phone) {
        const regex = /^(\+7|8)?\s?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;

        if (!this.isEmpty(phone) && this.isString(phone))
            return regex.test(phone)
        else return false
    }

    static isDate(value) {
        if (typeof value !== 'string') {
            return false;
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        return dateRegex.test(value);
    }

    static isTime(value) {
        if (typeof value !== 'string') {
            return false
        }

        const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
        return timeRegex.test(value);
    }

    static generate_jwt(
        userId,
        userName,
        userEmail,
        userRole,
        userFio = null,
        userAddress = null,
        userPhone = null
    ) {
        const payload = {
            userId,
            userName,
            userEmail,
            userRole,
            userFio,
            userAddress,
            userPhone
        }

        return jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY, {
                expiresIn: '24h'
            })
    }
}

module.exports = Validation