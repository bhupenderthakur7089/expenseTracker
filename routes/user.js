const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/user');
const userAuthenticate = require('../middleware/auth');

<<<<<<< HEAD
router.post('/resetPassword', userAuthenticate.authenticate, expenseController.resetPassword);
=======
router.post('/signUp', expenseController.signUp);

router.post('/login', expenseController.login);

router.get('/download', userAuthenticate.authenticate, expenseController.downloadExpenses)
>>>>>>> f1bdaf7d25a78d6b9dff07d84bb15e7829f08adc

module.exports = router;