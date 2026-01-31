require('dotenv').config() 
const mongoose = require('mongoose')

const mongourl =process.env.DB_CONNECTION_LINK;

mongoose.connect(mongourl)
.then(()=>{console.log("Mongo Db connection successful")})
.catch((err)=>{console.log(err)});