const express = require("express");
const cors = require('cors');
require("./db_conn");

const app = express()
const port = 5000

//Middlewares
app.use(express.json())
app.use(cors())

//Available routes
app.use('/api/auth', require('./routes/userAuth.js'))

app.listen(port,()=>{
    console.log(`Backend running on port ${port}`)
})