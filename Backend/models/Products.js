const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    sellerId :{
        type:String,
        // required: true
    },
    name : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    rating : {
        type : Number,
        default: 0 
    },
    ratingCount : {
        type : Number,
        default : 0
    },
    productDescription : {
        type : String,
        required : true
    },
    about : {
        type : String
    },
    category : {
        type :String
    },
    image : {
        type : String
    }

})

module.exports = mongoose.model('product',UserSchema);