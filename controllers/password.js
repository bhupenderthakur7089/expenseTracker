const uuid = require('uuid');
const bcrypt = require('bcrypt');
const ForgotPassword = require('../models/forgotPasswordRequests');
const User = require('../models/user');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const con = require('../util/database');
const dotenv = require('dotenv').config();

// const htmlContent = require('../models/templates.js');

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.EMAIL_API_KEY;

exports.forgotPassword = async (req, res) => {
    console.log('email api key is: ',process.env.EMAIL_API_KEY);
    User
        .findAll({ where: { email: req.body.email } })
        .then(async (user) => {
            console.log('user id is:', user[0].id)
            const requestId = uuid.v4();
            console.log('UUID is:', requestId);
            const t = await con.transaction();

            user[0].createForgotPassword({ id: requestId, isActive: true }, { transaction: t })
                .then(async (forgotPasswordRequest) => {
                    await t.commit();
                    const id = forgotPasswordRequest.id;
                    console.log('forgot password request ID is', req.body.email)

                    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
                    const sender = {
                        email: "tridev50423@gmail.com",
                        name: "Tri Dev",
                    };
                    const receivers = [
                        {
                            email: req.body.email,
                        },
                    ];

                    try {
                        await apiInstance.sendTransacEmail({
                            sender,
                            to: receivers,
                            subject: "Test Email from Brevo",
                            textContent: "Test Email",
                            text: 'and easy to do anywhere, even with Node.js',
                            htmlContent: `<a href="http://13.233.183.199:3000/resetPassword/${id}">Reset password</a>`,
                        }).then((data) => {
                            res.json(data);
                        }).catch(err => console.log('catch after then error: ', err));

                    } catch (error) {
                        console.log('catch error is: ', error);
                        res.send(error);
                    }
                })
                .catch(async (err) => {
                    console.log(err)
                    await t.rollback();
                    console.log(err)
                });
        })
        .catch(err => console.log(err));

}

exports.resetPassword = (req, res) => {
    console.log('requestId is:', req.params.id);
    const id = req.params.id;
    ForgotPassword.findOne({ where: { id } })
        .then(forgotpasswordrequest => {
            if (forgotpasswordrequest) {
                forgotpasswordrequest.update({ isActive: false });
                res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                )
                res.end()
            }
        })
}

exports.updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { requestId } = req.params;
        console.log(`requestId is:${requestId} and New Password is ${newpassword}`)
        ForgotPassword.findOne({ where: { id: requestId } })
            .then(forgotpasswordrequest => {
                User.findOne({ where: { id: forgotpasswordrequest.userId } }).then(user => {

                    if (user) {
                        //encrypt the password
                        const saltRounds = 10;
                        bcrypt.hash(newpassword, saltRounds, (err, hash) => {
                            console.log(hash);
                            if (err) {
                                console.log(err);
                                throw new Error(err);
                            }
                            user
                                .update({ password: hash })
                                .then(() => {
                                    res.status(201).json({ message: 'Successfuly update the new password' })
                                })
                        });
                    } else {
                        return res.status(404).json({ error: 'No user Exists', success: false })
                    }
                })
            })
    } catch (error) {
        return res.status(403).json({ error, success: false })
    }

}