const { Model, DataTypes } = require('sequelize');
const jwt = require('../common/utils/jwt');
const DB = require('../database');

class Login extends Model {
    static logoutUser(loginID) {
        return this.update({
            loggedOut: true,
            loggedOutAt: Sequelize.literal('CURRENT_TIMESTAMP')
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

Login.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user: DataTypes.INTEGER,
    logged_out: DataTypes.BOOLEAN,
    logged_out_at: {
            type: 'TIMESTAMP',
    }
}, {
    tableName: 'logins',
    underscored: true,
    timestamps: true,
    sequelize: DB
});

module.exports = Login;