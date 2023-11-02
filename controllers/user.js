const dotenv = require('dotenv').config();
const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const htmlContent = require('../models/templates.js')

const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.EMAIL_API_KEY;

exports.resetPassword = async (req, res) => {
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
            htmlContent,
        }).then((data) => {
            res.json(data);
        })
    } catch (error) {
        console.log(error);
        res.send(error);
    }

}
