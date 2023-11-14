const Expense = require('../models/expense');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const con = require('../util/database');

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
exports.fetchAllExpenses = (req, res) => {
    const pageNumber = req.params.pageNumber;
    console.log('page number is ', pageNumber);
    Expense.count({ where: { userId: req.user.id } })
        .then((total) => {
            totalExpense = total;
            return Expense.
                findAll({
                    where: { userId: req.user.id },
                    offset: (pageNumber - 1) * 2,
                    limit: 2
                })
                .then(expenses => {
                    console.log('Expenses are as follows:', expenses);
                    res.json({
                        expenses: expenses,
                        currentPage: pageNumber,
                        hasNextPage: 2 * pageNumber < totalExpense,
                        nextPage: pageNumber*1 + 1,
                        hasPreviousPage: pageNumber > 1,
                        previousPage: pageNumber - 1,
                        lastPage: Math.ceil(totalExpense / 2),
                    });
                })
        })

        .catch(err => console.log(err));
}

exports.generateAccessToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId: id, name: name, ispremiumuser }, 'h31k2h128dqdhdia');
}

exports.addExpense = async (req, res, next) => {
    const expense = req.body;
    const amnt = expense.amount;
    const desc = expense.description;
    const catg = expense.category;
    const t = await con.transaction();
    Expense.create({ amount: amnt, description: desc, category: catg, userId: req.user.id }, { transaction: t })
        .then(result => {
            let total = req.user.totalExpense * 1 + amnt * 1;
            req.user.update({ totalExpense: total }, { transaction: t })
                .then(async (data) => {
                    console.log(data);
                    await t.commit();
                    res.json(result);
                })
                .catch(async (err) => {
                    await t.rollback();
                    console.log(err)
                })
        })
        .catch(async (err) => {
            await t.rollback();
            console.log(err)
        });
}

exports.deleteExpense = async (req, res, next) => {
    const expenseId = req.params.expenseId;
    const t = await con.transaction();

    Expense.findAll({ where: { id: expenseId } })
        .then(expense => {
            expense[0].destroy({ transaction: t })
                .then((expense) => {
                    const newTotal = req.user.totalExpense - expense.amount;
                    req.user.update({ totalExpense: newTotal }, { transaction: t })
                        .then(async (data) => {
                            console.log(data);
                            await t.commit();
                            res.json({ data });
                        })
                        .catch(async (err) => {
                            await t.rollback();
                            console.log(err)
                        })
                })
                .catch(async (err) => {
                    console.log(err);
                    await t.rollback();
                })
        })
        .then(result => {
            if (result) {
                console.log('Expense Deleted Successfully');
            }
        })
        .catch(err => console.log(err));
}