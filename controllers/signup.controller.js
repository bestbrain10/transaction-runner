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
        const response = await User.register(req.body)
        res.status(201).data( response );
    }
}