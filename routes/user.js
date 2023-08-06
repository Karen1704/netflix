const userRouter = require('express').Router();
const User = require('../models/User');
const {auth,verifyAdmin,verifyAuthOrAdmin}  = require('../middleware/auth');
const { Error } = require('mongoose');



//Register a new User

userRouter.post('/register', async (req,res)=>{
    const newUser = new User({
      ...req.body,
      role:"user"
    })
    try{
        await newUser.save();

        const token = await newUser.generateAuthToken();
        res.status(201).send({newUser,token})
    }catch(err){
        res.status(500).send({
            "Error":err.message
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
    res.status(400).send({"Error":e.message}); 
  }
});

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


//Get Me 
userRouter.get('/me',auth, async (req,res)=>{
  try{
    res.status(200).send(req.user);
  }
  catch(err){
    res.status(400).send({
      "Error":err
    })
  }
})

//Get user by id
userRouter.get('/find/:id', verifyAuthOrAdmin , async (req,res)=>{
  try{
    const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send('User not found');
      }
    
    res.status(200).send({user});
  }
  catch(err){
    res.status(400).send({
      "Error":err
    })
  }
})







//Update a User
userRouter.patch('/me',auth,async (req,res)=>{
  const updates = Object.keys(req.body);
  const allowedUpdates =  ["username", "email", "password", "age"];
  
  const isValidOperation = updates.every((update)=>{
    return allowedUpdates.includes(update);
  })

  if(!isValidOperation){
    return res.status(400).send({ error: "Invalid upadate!" });
  }
  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });

    await req.user.save();
    res.status(200).send(req.user);
  } catch (err) {
    res.status(400).send(err);
  }
})


//Delete me
userRouter.delete('/me', auth, async (req,res)=>{
  try{
    await User.findByIdAndDelete(req.user._id);
    res.status(200).send("User was deleted")
  }
  catch(err){
    res.status(400).send({
      "Error":err
    })
  }
})


//Log out a user
userRouter.post('/logout',auth, async (req,res)=>{
  try{
    req.user.tokens = req.user.tokens.filter((token)=>{
      return token.token !== req.token
    })
    await req.user.save();
    res.status(200).send("User was logged out")
  }
  catch(err){
    res.status(400).send({
      "Error":err
    })
  }
})






//Make a user admin or movies Manager
userRouter.patch('/changerole/:id',verifyAdmin ,async (req,res)=>{
  const updates = Object.keys(req.body);
  const allowedUpdates =  ["role"];

  const user = await User.findById(req.params.id)

  const isValidOperation = updates.every((update)=>{
    return allowedUpdates.includes(update);
  })

  if(!isValidOperation){
    return res.status(400).send({ error: "Invalid upadate!" });
  }
  
  try {
    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    await user.save();
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
})













module.exports = userRouter;