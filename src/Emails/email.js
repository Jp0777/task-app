var elasticemail = require('elasticemail');
var client = elasticemail.createClient({
    username: 'J P',
    apiKey: 'CD911654023D74391BDDAF85098558172AC10C3B05E0FE14B36B0658EA6582790B85C0F1088D14B065FE1B679D64A118'
});

const sendWelcomeEmail = (email, name) => {
    var msg = {
        from: 'pateljayen07@gmail.com',
        from_name: 'Jayen Patel',
        to: email,
        subject: 'Account Created',
        body_text: `Welcome ${name},You have successfully signed up.`
    };

    client.mailer.send(msg, function (err, result) {
        if (err) {
            return console.error(err);
        }

        console.log(result);
    });
}

const sendCancellationEmail = (email, name) => {
    var msg = {
        from: 'pateljayen07@gmail.com',
        from_name: 'Jayen Patel',
        to: email,
        subject: 'Account Deleted',
        body_text: `Hello ${name},You have successfully deleted your account.`
    };

    client.mailer.send(msg, function (err, result) {
        if (err) {
            return console.error(err);
        }

        console.log(result);
    });
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}