const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true
        },
        name:{
            type:String,
        },
        password:{
            type:String,
            required:true
        },
        role:{
            type:String,
            default:"User",
        },
    },{timestamps:true}
)

module.exports = mongoose.model("User",userSchema);