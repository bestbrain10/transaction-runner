

const joi = require('joi');
const User = require('../models/user.model');
const Login = require('../../models/login.model');


module.exports = class {
    static get loginSchema() {
        return joi.object().keys({
            email: joi.string().email().required(),
            password: joi.string().required()
        });
    }

    static async login(req, res, next) {
        const user = await User.login(req.body);

        res.data(
          await  Login.loginUser(user)
        );
    }
}