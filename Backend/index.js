const express = require("express");
const cors = require('cors');
require("./db_conn");

const app = express();
const port = process.env.PORT || 5000;

//Middlewares
app.use(express.json())
app.use(cors(
    {
        origin:['https://amazon-clone-1-zuga.onrender.com'],
        methods:["POST","GET"],
        credentials: true
    }
));

//Available routes
app.use('/api/auth', require('./routes/userAuth.js'))

app.listen(port,()=>{
    console.log(`Backend running on port ${port}`)
})