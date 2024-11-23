const express =require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require('../models/User')

//Available Routes

router.post('/createuser',async(req,res)=>{
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({error: "sorry a user with this email already exists" });
        }
        const secPass = await bcrypt.hash(req.body.password, 10);
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        })
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occured");
    }

})

module.exports = router;