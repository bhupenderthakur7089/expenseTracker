const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/user');
const userAuthenticate = require('../middleware/auth');

router.post('/resetPassword', userAuthenticate.authenticate, expenseController.resetPassword);

module.exports = router;