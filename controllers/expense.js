const Expense = require('../models/expense');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const con = require('../util/database');



function generateAccessToken(id, name) {
    return jwt.sign({ userId: id, userName: name }, 'h31k2h128dqdhdia')
}


exports.fetchAllExpenses = (req, res) => {
    const pageNumber = (req.query.pageNumber)*1;
    const rowsPerPage = (req.query.rowsPerPage)*1;
    console.log('page number is ', pageNumber);
    console.log('Row Count Per Page ', rowsPerPage);
    Expense.count({ where: { userId: req.user.id } })
        .then((total) => {
            totalExpense = total;
            return Expense.
                findAll({
                    where: { userId: req.user.id },
                    offset: (pageNumber - 1) * rowsPerPage,
                    limit: rowsPerPage
                })
                .then(expenses => {
                    console.log('Expenses are as follows:', expenses);
                    res.json({
                        expenses: expenses,
                        currentPage: pageNumber,
                        hasNextPage: rowsPerPage * pageNumber < totalExpense,
                        nextPage: pageNumber * 1 + 1,
                        hasPreviousPage: pageNumber > 1,
                        previousPage: pageNumber - 1,
                        lastPage: Math.ceil(totalExpense / rowsPerPage),
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