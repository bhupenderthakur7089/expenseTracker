const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');

const con = require('./util/database');

const expenseRoute = require('./routes/expense');

const Expense = require('./models/expense');
const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(expenseRoute);
app.use(errorController.get404);

Expense.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Expense);
con
    .sync()
    .then((result) => {
        console.log(result);
        app.listen(3000);
    })
    .catch(err => console.log(err));

