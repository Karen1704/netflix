// const dotenv = require('dotenv')
// dotenv.config();

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name, code) => {
    sgMail.send({
        from: "kar.ghalachyan@gmail.com",
        to: email,
        subject: "Welcome to our Movies App",
        html: `<p>Welcome ${name}, click on this  button  to  verify your account</p> <br/>
         <a href=" http://localhost:3000/api/users/verify/${code}"><button>Verify</button></a>`
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
    }).then(() => {
        console.log('Email sent')
    })
        .catch((error) => {
            console.error(error)
        })
}

module.exports = { sendWelcomeEmail, cancelationEmail }