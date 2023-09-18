const Expense = require('../models/expense');
const User = require('../models/user');

exports.addNewUser = (req, res, next) => {
    const user = req.body;
    console.log(user.email);
    console.log(user.password);
    const uName = user.name;
    const uEmail = user.email;
    const uPass = user.password;
    User
        .create({
            name: uName,
            email: uEmail,
            password: uPass
        })
        .then(result => {
            res.json(result);
        })
        .catch(err => console.log(err));
}

exports.fetchAllExpenses = (req, res, next) => {
    Expense.
        findAll()
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
            category: catg
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