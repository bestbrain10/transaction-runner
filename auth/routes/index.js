const router = require('express').Router();
const Validator = require('../../common/middlewares/validator.middleware');
const SignupController = require('../controllers/signup.controller');
const LoginController = require('../controllers/login.controller');
const $ = require('express-async-handler');

router.post(
    '/signup', 
    Validator(SignupController.registerSchema), 
    $(SignupController.register)
);

router.post(
    '/login',
    Validator(LoginController.loginSchema),
    $(LoginController.login)
);


module.exports = router;