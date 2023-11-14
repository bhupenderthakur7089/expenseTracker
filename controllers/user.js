require('dotenv').config();
var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;

var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = 'xsmtpsib-4424fe5de884feb63f6cd82513b5f75a999a666f4c366410b86b063ee0a07766-j6XznWq4mhNA9fby';

var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
exports.resetPassword = (req, res) => {

    try {
        sendSmtpEmail = {
            to: [{
                email: req.body.emailId,
                name: 'John Doe'
            }],
            params: {
                name: 'John',
                surname: 'Doe'
            },
            headers: {
                'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
            }
        };


        apiInstance.sendTransacEmail(sendSmtpEmail)
            .then((data) => {
                res.json(data)
            })
            .catch(err => console.log(err))
    }
    catch (err) {
        console.log(err);
    }

}
