const userRouter = require('express').Router();
const User = require('../models/User');
const {auth,verifyAdmin}  = require('../middleware/auth');
const jwt = require("jsonwebtoken");



//Register a new User

userRouter.post('/register', async (req,res)=>{
    const newUser = new User(req.body)
    try{
        await newUser.save();

        const token = await newUser.generateAuthToken();
        res.status(201).send({newUser,token})
    }catch(err){
        res.status(500).send({
            "Error":err
        })
    }
})


//Log in a User
userRouter.post("/login", async (req, res) => {
    try {
      const user = await User.findByCredentials(
        req.body.username,
        req.body.password
      );
  
      const token = await user.generateAuthToken();
  
      res.send({ user, token });
    } catch (e) {
      res.status(400).send(e);
    }
  });


//Get Me 
userRouter.get('/me',auth, async (req,res)=>{
  try{
    const token  = req.header("Authorization").replace("Bearer ","");
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const users = await User.findById(decoded._id);
    res.send(users);
  }
  catch(err){
    res.status(400).send({
      "Error":err
    })
  }
})



//Get All Users
userRouter.get('/all', verifyAdmin, async (req,res)=>{
  try{
    const users = await User.find({});
    res.send(users);
  }
  catch(err){
    res.status(400).send({
      "Error":err
    })
  }
})




module.exports = userRouter;