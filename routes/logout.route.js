const router = require('express').Router();
const LogoutController = require('../controllers/logout.controller');
const $ = require('express-async-handler');

router.put('/logout', $(LogoutController.logout))

module.exports = router;