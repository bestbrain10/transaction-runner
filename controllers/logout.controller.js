const Login = require('../models/login.model');

module.exports = class {
    static async logout(req, res) {
        console.log(req.loginID);
        return res.data(
            await Login.logoutUser(req.loginID)
        );
    }
}