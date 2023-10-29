const Razorpay = require('razorpay');
const User = require('../models/user');
const Order = require('../models/orders');
const Expense = require('../models/expense');
const sequelize = require('../util/database');

exports.buyPremium = (req, res) => {

    var rzp = new Razorpay({
        key_id: 'rzp_test_aHwjaNMY3niUua',
        key_secret: 'zEplOBOcsmItP4xGc1Qo8tJJ'
    });
    // console.log(rzp);
    const amount = 2500;

    rzp.orders.create({ amount, currency: "INR" })
        .then((order) => {
            console.log(order);
            req.user.createOrder({ orderid: order.id, status: 'PENDING' })
                .then(() => {
                    res.json({ order, key_id: rzp.key_id });
                })
                .catch(err => console.log(err));
        })
        .catch((err) => console.log(err));

}

exports.updateTransactionStatus = (req, res) => {
    const userId = req.user.id;
    const { payment_id, order_id } = req.body;
    // console.log(order_id);
    Order
        .findOne({ where: { orderid: order_id } })
        .then(order => {
            console.log(order);
            const promise1 = order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });
            const promise2 = req.user.update({ ispremiumuser: true });
            Promise.all([promise1, promise2])
                .then(() => {
                    return res.json({ sucess: true, message: "Transaction Successful", token: Expense.generateAccessToken(userId, req.user.name, true) });
                }).catch((error) => {
                    throw new Error(error)
                })
        })
        .catch(err => console.log(err));
}

exports.getUserLeaderBoard = (req, res) => {
    console.log('user id is: ', req.user.id);
    Expense.findAll({
        attributes: ['userId', [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']],
        group: ['userId'],
        include: User,
        order: [['totalAmount', 'DESC']]
    })
        .then((expenses) => {
            // console.log('User:', req.user.name);
            // console.log('Expenses:');
            // expenses.forEach((expense) => {
            //     console.log('Expense Name:', expense.description);
            //     console.log('Amount:', expense.amount);
            // });
            res.json(expenses);
        })
        .catch((error) => {
            console.error('Error fetching expenses:', error);
        });


    // User.findAll({
    //     attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expense.amount')), 'total_cost']],
    //     include: [
    //         {
    //             model: Expense,
    //             attributes: []
    //         }
    //     ],
    //     group: ['user.id'],
    //     order: [['total_cost', 'DESC']]

    // })
    //     .then((result) => {
    //         console.log(result);
    //         res.json(result);
    //     })
    //     .catch((err) => console.log(err));

}