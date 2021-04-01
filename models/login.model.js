const { Model } = require('sequelize');
const jwt = require('../common/utils/jwt');


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

    static decodeLoginToken(token) {
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.loginID) {
            return null;
        }

        return loginID;
    }

    static verifyLogin(loginID) {
        return this.findOne({
            where: {
                id: loginID,
                loggedOut: false
            },
            attributes: ['user']
        });
    }

    static async loginUser(user) {
        const userLogin = await this.create({
            user: user.id
        });

        return Object.assign(user.toJSON(), {
            token: jwt.encode({ loginID: userLogin.id })
        });
    }
}