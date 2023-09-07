const accountSid = "AC92853d3280f1a5b1b5e3efb1e375588e";
const authToken = "91472a91359db97e0d4eaaecb2eb66c2";
const serviceSid = "VAa986cdd7cde8995296bf691d456ad685"

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

const verificationSms = (phoneNumber, channel) => {
  client.verify.v2.services(serviceSid)
    .verifications
    .create({
      to: phoneNumber,
      channel: channel
    })
    .then(verification => console.log(verification.sid));
}

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

