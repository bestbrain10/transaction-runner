const { Model } = require('sequelize/types');
const jwt = require('../../common/utils/jwt');


module.exports = class Login extends Model {
    static logoutUser(loginID) {
        return this.update({
            loggedOut: true,
        },{
            where: { 
                id: loginID,
                loggedOut: false,
            },
        })
    }

    static verifyLogin(loginID) {
        return this.findOne({
            where: {
                id: loginID,
                loggedOut: false
            }
        });
    }

    static async loginUser(user) {
        const userLogin = await this.create({
            user: user.id
        });

        return Object.assign(user.toJSON(), {
            token: jwt.encode({ id: userLogin.id })
        });
    }
}