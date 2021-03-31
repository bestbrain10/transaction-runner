const { Model } = require("sequelize/types");
const hashPassword = require('../../common/utils/hash-password');

module.exports = class User extends Model {

    comparePassword(inputPassword) {
        return this.password === hashPassword(inputPassword);
    }

    static async register(user) {
        const emailExists = await this.count({
            where: { email: user.email },
        });

        if(emailExists) {
            return Promise.reject({ email: 'Email already exists' });
        }

        return this.create({
            ...user,
            password: hashPassword(user.password)
        })
    }

    static async login(loginParams) {
        const user = await this.findOne({
            where: {
                email: loginParams.email
            },
        });

        if (user) {
            return Promise.reject({ email: 'Email does not exist' });
        }

        if(user.comparePassword(loginParams.password)) {
            return Promise.reject({ password: 'Incorrect password' });            
        }

        return user;
    }
}