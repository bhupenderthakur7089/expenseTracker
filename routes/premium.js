const express = require('express');
const router = express.Router();
const premiumController = require('../controllers/premium');
const userAuthenticate = require('../middleware/auth');

router.get('/buyPremium', userAuthenticate.authenticate, premiumController.buyPremium);

router.post('/updatetransactionstatus', userAuthenticate.authenticate, premiumController.updateTransactionStatus);

// router.get('/showLeaderBoard', userAuthenticate.authenticate, premiumController.getUserLeaderBoard);

module.exports = router;