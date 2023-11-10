const Expense = require('../models/expense');
const jwt = require('jsonwebtoken');
const con = require('../util/database');

exports.fetchAllExpenses = (req, res, next) => {
    Expense.
        findAll({ where: { userId: req.user.id } })
        .then(expenses => {
            res.json(expenses);
        })
        .catch(err => console.log(err));
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

    Expense
        .findAll({ where: { id: expenseId } })
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


exports.generateAccessToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId: id, name: name, ispremiumuser }, 'h31k2h128dqdhdia');
}