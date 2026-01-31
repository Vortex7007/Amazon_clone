const express =require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/User')

// Middleware to verify JWT token
const authenticateUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    req.userId = decoded.user.id;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};

//Available Routes

//create a new user
router.post('/createuser',async(req,res)=>{
    try {
        let user = await User.findOne({ mobile: req.body.mobile });
        if (user) {
            return res.status(400).json({error: "sorry a user with this number already exists" });
        }
        const secPass = await bcrypt.hash(req.body.password, 10);
        user = await User.create({
            name: req.body.name,
            password: secPass,
            mobile: req.body.mobile
        })
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occured");
    }

})

//check if the user exists or not
router.post('/checkuser', async(req, res)=>{
    try{
        let user = await User.findOne({ mobile: req.body.mobile});
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

// GET current user info
router.get('/user', authenticateUser, async(req, res)=>{
    try{
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Some Error Occured");
    }
})

//

module.exports = router;