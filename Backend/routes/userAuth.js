const express =require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require('../models/User')

//Available Routes

router.post('/createuser',async(req,res)=>{
    try {
        let user = await User.create({
            name : req.body.name,
            password : req.body.password,
            email : req.body.email
        })
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occured");
    }

})

module.exports = router;