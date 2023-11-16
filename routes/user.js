const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/user');
const userAuthenticate = require('../middleware/auth');

router.post('/signUp', expenseController.signUp);

router.post('/login', expenseController.login);

router.get('/download', userAuthenticate.authenticate, expenseController.downloadExpenses)

module.exports = router;