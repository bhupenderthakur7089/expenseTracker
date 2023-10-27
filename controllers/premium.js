const Razorpay = require('razorpay');
const Order = require('../models/orders');
const expense = require('./expense');

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
            Promise.all([promise1, promise2]).then(() => {
                return res.json({ sucess: true, message: "Transaction Successful", token: expense.generateAccessToken(userId, undefined, true) });
            }).catch((error) => {
                throw new Error(error)
            })
        })
        .catch(err => console.log(err));
}

const getUserLeaderBoard = async (req, res) => {
    try {
        const leaderboardofusers = await User.findAll({
            attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.expenseamount')), 'total_cost']],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ['user.id'],
            order: [['total_cost', 'DESC']]

        })

        res.status(200).json(leaderboardofusers)

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}