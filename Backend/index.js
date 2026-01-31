const express = require("express");
const cors = require('cors');
const path = require('path');
require("./db_conn");

const app = express();
const port = process.env.PORT || 5000;

//Middlewares
app.use(express.json())
app.use(cors());

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Available routes
app.use('/api/verify', require('./routes/otpfull.js'))
app.use('/api/auth', require('./routes/userAuth.js'))
app.use('/api/products', require('./routes/products.js'))
app.use('/api/seller', require('./routes/sellerAuth.js'))
app.use('/api/seller', require('./routes/seller.js'))
app.use('/api/cart', require('./routes/cart.js'))
app.use('/api/address', require('./routes/address.js'))
app.use('/api/orders', require('./routes/orders.js'))

app.listen(port,()=>{
    console.log(`Backend running on port ${port}`)
})
