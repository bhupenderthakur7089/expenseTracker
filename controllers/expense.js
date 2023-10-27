const Expense = require('../models/expense');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signUp = (req, res) => {
    console.log(req.body);
    const user = req.body;
    const uName = user.name;
    const uEmail = user.email;
    const uPass = user.password;
    const saltRound = 10;
    bcrypt.hash(uPass, saltRound, (err, hash) => {
        console.log(hash);
        User
            .findAll({ where: { email: uEmail } })
            .then(user => {
                if (user.length > 0) {
                    res.json({ userExists: true });
                } else {
                    User
                        .create({
                            name: uName,
                            email: uEmail,
                            password: hash
                        })
                        .then(result => {
                            console.log(result);
                            res.json({ userExists: false });
                        })
                }
            })
            .catch(err => console.log(err));
    });

}
function generateAccessToken(id, name) {
    return jwt.sign({ userId: id, userName: name }, 'h31k2h128dqdhdia')
}
exports.login = (req, res, next) => {
    const credentials = req.body;
    const uEmail = credentials.email;
    const uPass = credentials.password;
    console.log(uEmail, uPass);
    User
        .findAll({ where: { email: uEmail } })
        .then(user => {
            if (user[0]) {
                bcrypt.compare(uPass, user[0].password, (err, result) => {
                    if (err) {
                        throw new Error('Something went wrong')
                    }
                    if (result === true) {
                        return res.status(200).json({
                            loginStatus: true, message: "User logged in successfully", token: generateAccessToken(user[0].id, user[0].name)
                        })
                    }
                    else if (result === false) {
                        return res.json({
                            loginStatus: false, message: "Password is incorrect"
                        })
                    }
                })
            } else {
                res.json({ loginStatus: 'User Not Found' });
            }
        })
        .catch(err => { console.log(err) });
}
exports.fetchAllExpenses = (req, res, next) => {
    Expense.
        findAll({ where: { userId: req.user.id } })
        .then(expenses => {
            res.json(expenses);
        })
        .catch(err => console.log(err));
}

exports.generateAccessToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId: id, name: name, ispremiumuser }, 'secretkey');
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