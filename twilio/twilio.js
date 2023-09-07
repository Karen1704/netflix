const accountSid = process.env.VAb340506d1ad43bb8f79dad798b6e10c3;
const authToken = process.env.AUTH_TOKEN;
const serviceSid = process.env.SERVICE_SID

const client = require('twilio')(accountSid, authToken);

const phoneMessage = () => {
  client.messages
    .create({
      body: `First twilio message your code is ${Math.floor(Math.random() * (999999 - 100001 + 1) + 100001)}`,
      from: '+16562230183',
      to: '+37491604506'
    })
    .then(message => console.log(message.sid));
}

// const verificationSms = (phoneNumber, channel) => {
//   client.verify.v2.services(serviceSid)
//     .verifications
//     .create({
//       to: phoneNumber,
//       channel: channel
//     })
//     .then(verification => console.log(verification.sid))
//     .catch((error) => {
//       console.error(error)
//     });
// }

const verificationSms = async (phoneNumber, channel) => {
  try {
    const verification = await client.verify.v2.services(serviceSid)
      .verifications
      .create({
        to: phoneNumber,
        channel: channel
      });

    console.log(verification.sid);
  } catch (error) {
    console.error("Error creating verification:", error);
  }
};


const verifySmsCode = (phoneNumber, verificationCode) => {
  // In the /verify-code route handler
  return client.verify.v2.services(serviceSid)
    .verificationChecks
    .create({ to: phoneNumber, code: verificationCode })
    .then(verificationCheck => {
      if (verificationCheck.status === 'approved') {
        // Verification succeeded
        // Handle success (e.g., redirect to a success page)
        // res.status(200).send("Verified");
        console.log("Verified");
        return true;
      } else {
        // Verification failed
        // Handle error (e.g., display an error message)
        // res.status(400).send("Verification failed")
        console.log("Verification failed")
        return false;
      }
    })
    .catch(err => {
      // res.status(400).send(err);
      console.log(err)
    });

}



module.exports = { phoneMessage, verificationSms, verifySmsCode };