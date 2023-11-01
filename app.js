const express = require('express');
const app = express();
var cors = require('cors')

const path = require('path');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');

const con = require('./util/database');

const expenseRoute = require('./routes/expense');
const premiumRoute = require('./routes/premium');

const Expense = require('./models/expense');
const User = require('./models/user');
const Order = require('./models/orders');

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(cors());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(expenseRoute);
app.use(premiumRoute);
app.use(errorController.get404);

Expense.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Expense);

Order.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Order);

con
    .sync({ force: true })
    .then((result) => {
        console.log(result);
        app.listen(3000);
    })
    .catch(err => console.log(err));
