// const dotenv = require('dotenv')
// dotenv.config();

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        from: "kar.ghalachyan@gmail.com",
        to: email,
        subject: "Welcome to our Movies App",
        text: `Welcome ${name}`
    }).then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
};

const cancelationEmail = (email, name) => {
    sgMail.send({
        from: "kar.ghalachyan@gmail.com",
        to: email,
        subject: "Sad to see you leaving",
        text: `GoodBye ${name}, hope will see you soon`,
    })
}

module.exports = {sendWelcomeEmail,cancelationEmail}