
const User = require('../models/user.model');
const UserTransaction = require('../models/transaction.model');

module.exports = class {
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
            incomingTransactions: UserTransaction.incomingTransactions(req.params.user),
            outgoingTransactions: UserTransaction.outgoingTransactions(req.params.user),
        });
    }
}