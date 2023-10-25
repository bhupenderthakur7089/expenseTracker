const Expense = require('../models/expense');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.fetchAllExpenses = (req, res, next) => {
    Expense.
        findAll({ where: { userId: req.user.id } })
        .then(expenses => {
            res.json(expenses);
        })
        .catch(err => console.log(err));
}

exports.addExpense = (req, res, next) => {
    const expense = req.body;
    const amnt = expense.amount;
    const desc = expense.description;
    const catg = expense.category;
    Expense
        .create({
            amount: amnt,
            description: desc,
            category: catg,
            userId: req.user.id
        })
        .then(result => {
            console.log('Expense Added successfully...');
            res.json(result);
        })
        .catch(err => console.log(err));
}

exports.deleteExpense = (req, res, next) => {
    const expenseId = req.params.expenseId;
    Expense.findAll({ where: { id: expenseId } })
        .then(expense => {
            return expense[0].destroy();
        })
        .then(result => {
            if (result) {
                console.log('Expense Deleted Successfully');
            }
        })
        .catch(err => console.log(err));
}