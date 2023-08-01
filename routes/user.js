const userRouter = require('express').Router();
const User = require('../models/User');


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


//




module.exports = userRouter;