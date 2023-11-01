const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense');
const userAuthenticate = require('../middleware/auth');

router.post('/signUp', expenseController.signUp);

router.post('/login', expenseController.login);

router.get('/expenses', userAuthenticate.authenticate, expenseController.fetchAllExpenses);

router.post('/addExpense', userAuthenticate.authenticate, expenseController.addExpense);

router.get('/deleteExpense/:expenseId', userAuthenticate.authenticate, expenseController.deleteExpense);

module.exports = router;