const express = require('express');
const expenseController = require('../controllers/expense');
const router = express.Router();

router.get('/expenses', expenseController.fetchAllExpenses);
router.post('/addExpense', expenseController.addExpense);

router.get('/deleteExpense/:expenseId', expenseController.deleteExpense);

module.exports = router;