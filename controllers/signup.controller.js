const joi = require('joi');
const User = require('../models/user.model');

module.exports = class {

    static get registerSchema() {
        return joi.object().keys({
            fullname: joi.string().required(),
            email: joi.string().email().required(),
            password: joi.string().required()
        });
    }

    static async register(req, res, next) {
        res.status(201).data(
            await User.register(req.body)
        );
    }
}