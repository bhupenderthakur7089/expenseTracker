const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const Expense = require('../models/expense');


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

function generateAccessToken(id, name) {
    return jwt.sign({ userId: id, userName: name }, 'h31k2h128dqdhdia')
}

exports.downloadExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll({ where: { userId: req.user.id } })
        const stringifiedExpenses = JSON.stringify(expenses);
        const fileName = `expenses${req.user.id}/${new Date()}.txt`;
        const fileURL = await uploadToS3(stringifiedExpenses, fileName);
        console.log('file URL is:', fileURL);
        res.json({ fileURL, success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }

}

function uploadToS3(data, fileName) {
    return new Promise((resolve, reject) => {
        const bucketName = 'exp70188';
        const IAM_USER_KEY = 'AKIAVMPMOSEFOCDMAB77';
        const IAM_SECRET_KEY = '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';
        let s3Bucket = new AWS.S3({
            accessKeyId: IAM_USER_KEY,
            secretAccessKey: IAM_SECRET_KEY,
        })
        let fileURL = '';
        s3Bucket.createBucket(() => {
            var params = {
                Bucket: bucketName,
                Key: fileName,
                Body: data,
                ACL: 'public-read'
            }
            s3Bucket.upload(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.Location)
                }
            });
        });
    });
}
