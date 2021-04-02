
const joi = require('joi');
const UserTransaction = require('../models/transaction.model');

module.exports = class {

    static async balanceCheck(req, res, next) {
        if(req.user.balance < req.body.amount) {
            return res.status(400).error({
                amount: 'Insufficient balance for transaction'
            });
        }

        next();
    }

    static get transferSchema() {
        return joi.object().keys({
            user: joi.number().integer().positive().required(),
            amount: joi.number().positive().required()
        })
    }

    static async transfer(req, res, next) {
        res.data(
            await UserTransaction.transfer({
                from: req.user.id,
                to: req.body.user,
                amount: req.body.amount
            })
        )
    }

    static get depositSchema() {
        return joi.object().keys({
            amount: joi.number().positive().required()
        })
    }

    static async deposit(req, res, next) {
        res.data(
            await UserTransaction.deposit(
                req.user.id,
                req.body.amount
            )
        )
    }
}