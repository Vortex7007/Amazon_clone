function OtpVerification(){
    const accountSid = process.env.REACT_APP_ACCOUNT_SIP;
    const authToken = process.env.REACT_APP_AUTHTOKEN;
    const client = require('twilio')(accountSid, authToken);
    client.messages
        .create({
            body: "hello from node js",
            to: '+917294874549',
            from : '+17622660661'
        })
        .then(message => console.log(message.sid));
}
export default OtpVerification;