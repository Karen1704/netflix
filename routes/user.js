const userRouter = require('express').Router();
const User = require('../models/User');
const validator  = require('validator');
const CryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');


//Register a new User

userRouter.post('/register', async (req,res)=>{
    const newUser = new User({
        username:req.body.username,
        email:req.body.email,
        password:CryptoJs.AES.encrypt(req.body.password,'Secret PassPhrase').toString()
    })
    try{
        const savedUser = await newUser.save();
        res.status(201).send(savedUser)
    }catch(err){
        res.status(500).send({
            "Error":err
        })
    }
})


//Log in a User
userRouter.post('/login',async (req,res)=>{
    try{
        const user = await User.findOne({
            username:req.body.username,
        })

        !user && res.status(401).send("Wrong credentials")

        const hashedPassword = CryptoJs.AES.decrypt(user.password,'Secret PassPhrase');

        const OriginalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);

        OriginalPassword!==req.body.password && res.status(401).send("Wrong credentials");

        const accessToken = jwt.sign(
            {
              id: user._id,
              role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '2d' }
          );
          
        
        const {password, ...others} = user._doc;
        res.status(200).send({others,accessToken})

    }
    catch(err){
        res.status(500).send({
            "Error":err
        })
    }
})



module.exports = userRouter;