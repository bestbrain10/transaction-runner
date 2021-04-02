
const User = require('../models/user.model');
const UserTransaction = require('../models/transaction.model');

module.exports = class {
    static async profile(req, res, next) {
        res.data({
            ...req.user,
            incomingTransactions: await UserTransaction.incomingTransactions(req.user.id),
            outgoingTransactions: await UserTransaction.outgoingTransactions(req.user.id),
        });
    }

    static async getAllUsers(req, res, next) {
        const { limit = 30, skip = 0 } = req.query;
        res.data(
            await User.findAll({
                limit,
                offset: skip
            })
        );
    }

    static async getOneUser(req, res, next) {
        const user = await User.findByPk(req.params.user);

        if(!user) {
            return res.status(404).errorMessage('User not found');
        }

        res.data({
            ...user.toJSON(),
            incomingTransactions: await UserTransaction.incomingTransactions(req.params.user),
            outgoingTransactions: await UserTransaction.outgoingTransactions(req.params.user),
        });
    }
}