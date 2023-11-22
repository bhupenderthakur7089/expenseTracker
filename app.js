const express = require('express');
const app = express();
var cors = require('cors')

const path = require('path');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');

const con = require('./util/database');

const expenseRoute = require('./routes/expense');
const premiumRoute = require('./routes/premium');
const user = require('./routes/user');
const password = require('./routes/password');

const Expense = require('./models/expense');
const User = require('./models/user');
const Order = require('./models/orders');
const forgotPasswordRequests = require('./models/forgotPasswordRequests');
// console.log('dev mode is:', process.env.NODE_ENV);
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(cors());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(user);
app.use(password);
app.use(expenseRoute);
app.use(premiumRoute);
app.use(user);
app.use(errorController.get404);

Expense.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Expense);

Order.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Order);

forgotPasswordRequests.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(forgotPasswordRequests);
con
    .sync()
    .then((result) => {
        console.log(result);
        app.listen(3000);
    })
    .catch(err => console.log(err));