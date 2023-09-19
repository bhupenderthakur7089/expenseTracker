const Expense = require('../models/expense');
const User = require('../models/user');

exports.addNewUser = (req, res, next) => {
    const user = req.body;
    const uName = user.name;
    const uEmail = user.email;
    const uPass = user.password;
    User
        .findAll({ where: { email: uEmail } })
        .then(user => {
            console.log(user[0]);
            if (user[0]) {
                console.log('User Already Exists');
                res.json({ userExists: true });
            } else {
                console.log('User Do not Exists');
                User
                    .create({
                        name: uName,
                        email: uEmail,
                        password: uPass
                    })
                    .then(result => {
                        res.json({ userExists: false });
                    })
            }
        })
        .catch(err => console.log(err));


}
exports.checkLogin = (req, res, next) => {
    const credentials = req.body;
    const uEmail = credentials.email;
    const uPass = credentials.password;
    console.log(uEmail, uPass);
    User
        .findAll({ where: { email: uEmail } })
        .then(user => {
            if (user[0]) {
                if (user[0].password == uPass) {
                    console.log(user[0]);
                    res.json({ loginStatus: true });
                } else {
                    res.json({ loginStatus: false });
                }
            } else {
                res.json({ loginStatus: 'User Not Found' });
            }
        })
        .catch(err => { console.log(err) });
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