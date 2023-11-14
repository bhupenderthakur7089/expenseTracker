const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense');
const userAuthenticate = require('../middleware/auth');

<<<<<<< HEAD
router.post('/signUp', expenseController.signUp);

router.post('/login', expenseController.login);

router.get('/expenses/:pageNumber', userAuthenticate.authenticate, expenseController.fetchAllExpenses);
=======
router.get('/expenses', userAuthenticate.authenticate, expenseController.fetchAllExpenses);
>>>>>>> f1bdaf7d25a78d6b9dff07d84bb15e7829f08adc

router.post('/addExpense', userAuthenticate.authenticate, expenseController.addExpense);

router.get('/deleteExpense/:expenseId', userAuthenticate.authenticate, expenseController.deleteExpense);

module.exports = router;