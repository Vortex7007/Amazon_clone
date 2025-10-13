const express = require("express");
const cors = require('cors');
require("./db_conn");

const app = express();
const port = process.env.PORT || 5000;

//Middlewares
app.use(express.json())
app.use(cors());

//Available routes
app.use('/api/verify', require('./routes/otpfull.js'))
app.use('/api/auth', require('./routes/userAuth.js'))
app.use('/api/products', require('./routes/products.js'))

app.listen(port,()=>{
    console.log(`Backend running on port ${port}`)
})