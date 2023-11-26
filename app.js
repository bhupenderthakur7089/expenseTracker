const express = require('express');
const https = require('https');
const cors = require('cors');
const path = require('path');
const con = require('./util/database');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const fs = require('fs');

const app = express();

const expenseRoute = require('./routes/expense');
const premiumRoute = require('./routes/premium');
const user = require('./routes/user');
const password = require('./routes/password');
const morgan = require('morgan');
const Expense = require('./models/expense');
const User = require('./models/user');
const Order = require('./models/orders');
const forgotPasswordRequests = require('./models/forgotPasswordRequests');
// console.log('dev mode is:', process.env.NODE_ENV);
app.set('view engine', 'ejs');
app.set('views', 'views');

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
);

// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(user);
app.use(password);
app.use(expenseRoute);
app.use(premiumRoute);
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
        // https
        //     .createServer({ key: privateKey, cert: certificate })
        app.listen(3000);
    })
    .catch(err => console.log(err));