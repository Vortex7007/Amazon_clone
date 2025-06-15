function OtpVerification(){
    const accountSid = 'ACbcdc353fd04e6115b16219ed2144d6ac';
    const authToken = 'e589795258a79aa23ceb0ad9458fc0bc';
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