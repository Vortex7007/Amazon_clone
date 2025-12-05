const express =require("express");
const router = express.Router();
const Seller = require('../models/Seller');
const bcrypt = require("bcryptjs");

//Available Routes

//create a new user
router.post('/createseller',async(req,res)=>{
    try {
        let user = await Seller.findOne({ mobile: req.body.mobile });
        if (user) {
            return res.status(400).json({error: "sorry a seller with this number already exists" });
        }
        const secPass = await bcrypt.hash(req.body.password, 10);
        user = await Seller.create({
            companyname: req.body.companyname,
            owner: req.body.owner,
            operatingcity: req.body.operatingcity,
            mobile: req.body.mobile,
            password : secPass
        })
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occured");
    }

})

//check if the user exists or not
router.post('/checkseller', async(req, res)=>{
    try{
        let user = await Seller.findOne({ mobile: req.body.mobile});
        if (!user) {
            return res.status(200).json({
                action : "signup" ,
                message: "looks like you are new here please sign up to continue" 
            });
        }
        else{
            return res.status(200).json({
                action : "login" ,
                message: "give password",
                userId: user._id
            });
        }
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Some Error Occured");
    }
})

module.exports = router;