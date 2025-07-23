require('dotenv').config();
const express =require("express");
const router = express.Router();
const twilio = require('twilio');

//dot env variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

function generateOTP() {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += numbers[Math.floor(Math.random() * numbers.length)];
  }
  return otp;
}

//Available Routes

//create a new user
router.post('/verifyotp',async(req,res)=>{
    try {
        const { mobile, name, password} = req.body;
        if (!mobile || !name || !password) {
            return res.status(400).json({ error: "Missing data. Please restart signup." });
        }
        const newotp = generateOTP();
        // Send OTP via Twilio
        await client.messages.create({
            body: `Your OTP is ${newotp}`,
            to: mobile,
            from: process.env.TWILIO_PHONE_NUMBER
        });
        res.status(200).json({
            message: "OTP sent successfully",
            otp: newotp
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occured");
    }

})

//

module.exports = router;