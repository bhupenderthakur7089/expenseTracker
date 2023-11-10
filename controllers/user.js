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

    await Expense.
        findAll({ where: { userId: req.user.id } })
        .then(expenses => {
            console.log(expenses);
            const stringifiedExpenses = JSON.stringify(expenses);
            const fileName = `expenses${req.user.id}/${new Date()}.txt`;
            const fileURL = uploadToS3(stringifiedExpenses, fileName);
            res.json({ fileURL, success: true });
        })
        .catch(err => console.log(err));

};

function uploadToS3(data, fileName) {
    const bucketName = 'exp70188';
    const IAM_USER_KEY = 'AKIAVMPMOSEFOCDMAB77';
    const IAM_SECRET_KEY = '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';
    let s3Bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_SECRET_KEY,
    })
    s3Bucket.createBucket(() => {
        var params = {
            Bucket: bucketName,
            Key: fileName,
            Body: data,
            ACL: 'public-read'
        }
        s3Bucket.upload(params, (err, s3reponse) => {
            if (err) {
                console.log(err);
            } else {
                console.log('success', s3reponse);
            }
        })
    })
}