const mongoose = require('mongoose');
const validator  = require("validator");
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
        },
        name:{
            type:String,
        },
        email:{
            type:String,
            trim:true,
            lowercase:true,
            unique:true,
            required:false,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error('Email is not valid')
                }
            }
        },
        password:{
            type:String,
            required:true,
            minLength:8,
            validate(value) {
                if (value.toLowerCase().includes("password")) {
                  throw new Error("Password can not contain the word 'password' ");
                }
              },
        },
        role:{
            type:String,
            default:"user",
            enum: ['admin', 'user','movieManager']
        },
    },{timestamps:true}
)


//Hash the plain text password before saving
userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 8);
    }
  
    next();
  });

module.exports = mongoose.model("User",userSchema);