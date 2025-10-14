const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    companyname : {
        type : String,
        required : true
    },
    mobile : {
        type : String,
        required : true
    },
    owner : {
        type : String,
        required : true
    },
    operatingcity : {
        type : String
    },
    password : {
        type: String,
        required : true
    }
})
module.exports = mongoose.model('seller',UserSchema);