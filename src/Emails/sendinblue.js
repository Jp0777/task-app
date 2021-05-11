var SibApiV3Sdk = require('sib-api-v3-sdk');
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.SENDINBLUE_API_KEY;

const sendEmail = (email, name, msg) => {
    new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail(
        {
            'subject': 'Hello from the Node SDK!',
            'sender': { 'email': 'pateljayen07@gmail.com', 'name': 'Jayen Patel' },
            'replyTo': { 'email': 'pateljayen07@gmail.com', 'name': 'Jayen Patel' },
            'to': [{ 'name': name, 'email': email }],
            'htmlContent': '<html><body><h1>This is a transactional email {{params.bodyMessage}}</h1></body></html>',
            'params': { 'bodyMessage': msg }
        }
    ).then(function (data) {
        console.log(data);
    }, function (error) {
        console.error(error);
    });
}

module.exports = sendEmail