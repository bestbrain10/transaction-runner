const router = require('express').Router();
const UserController = require('../controllers/user.controller');
const $ = require('express-async-handler');


router.get(
	'/',
	$(UserController.getAllUsers)
);

router.get(
	'/profile',
	$(UserController.profile)
);

router.get(
	'/:user',
	$(UserController.getOneUser)
);

module.exports = router;