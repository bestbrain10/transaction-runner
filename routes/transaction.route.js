const router = require('express').Router();
const TransactionController = require('../controllers/transaction.controller');
const $ = require('express-async-handler');
const Validator = require('../common/middlewares/validator.middleware');

router.post(
	'/deposit', 
	Validator(TransactionController.depositSchema), 
	$(TransactionController.deposit)
);

router.post(
	'/transfer', 
	Validator(TransactionController.transferSchema), 
	$(TransactionController.balanceCheck),
	$(TransactionController.transfer)
);

module.exports = router;