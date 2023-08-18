const userRouter = require('express').Router();
const User = require('../models/User');
const { auth, verifyAdmin, verifyAuthOrAdmin } = require('../middleware/auth');
const { Error } = require('mongoose');
const multer = require("multer");
const sharp = require('sharp');
const {sendWelcomeEmail,cancelationEmail} = require('../email/account')




//Register a new User

userRouter.post('/register', async (req, res) => {
  const newUser = new User({
    ...req.body,
    role: "user"
  })

  try {
    await newUser.save();
    sendWelcomeEmail(newUser.email,newUser.name)
    const token = await newUser.generateAuthToken();
    res.status(201).send({ newUser, token })
  } catch (err) {
    res.status(400).send({
      "Error": err.message
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
    res.status(400).send({ "Error": e.message });
  }
});

//Get All Users
userRouter.get('/all', verifyAdmin, async (req, res) => {
  try {
    let query = {};
    const role = req.query.role; 
    switch (true) {
      case !!role:
        query.role = req.query.role
        break
    }
    const users = await User.find(query);
    res.send(users);
  }
  catch (err) {
    res.status(400).send({
      "Error": err.message
    })
  }
})


//Get Me 
userRouter.get('/me', auth, async (req, res) => {
  try {
    
    res.status(200).send(req.user);

  }
  catch (err) {
    res.status(400).send({
      "Error": err.message
    })
  }
})

//Get user by id
userRouter.get('/find/:id', verifyAuthOrAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).send({ user });
  }
  catch (err) {
    res.status(400).send({
      "Error": err.message
    })
  }
})







//Update a User
userRouter.patch('/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["username", "email", "password", "age"];

  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  })

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid upadate!" });
  }
  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });

    await req.user.save();
    res.status(200).send(req.user);
  } catch (err) {
    res.status(400).send(err.message);
  }
})


//Delete me
userRouter.delete('/me', auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).send("User was deleted")
    cancelationEmail(req.user.email,req.user.name)
  }
  catch (err) {
    res.status(400).send({
      "Error": err.message
    })
  }
})


//Log out a user
userRouter.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save();
    res.status(200).send("User was logged out")
  }
  catch (err) {
    res.status(400).send({
      "Error": err.message
    })
  }
})






//Make a user admin or movies Manager
userRouter.patch('/changerole/:id', verifyAdmin, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["role"];

  const user = await User.findById(req.params.id)

  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  })

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid upadate!" });
  }

  try {
    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    await user.save();
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
})

//Upload avatar for user

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image(jpg or png)'))
    }

    cb(undefined, true)
  }
})

userRouter.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).jpeg().toBuffer();

  req.user.avatar = buffer;
  req.user.avatar_url = `${process.env.URL}/api/users/avatar`
  await req.user.save();
  res.status(200).send(req.user);

},
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
)


//Get user avatar
userRouter.get('/avatar',auth, async (req,res)=>{
  try {
    if (!req.user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(req.user.avatar);
  } catch (e) {
    res.status(400).send({"Error":err.message});
  }
})


//Delete user avatar

userRouter.delete("/avatar", auth, async (req, res) => {
  try{
  req.user.avatar = undefined;
  await req.user.save();
  res.status(200).send({
    "message":"User's avatar was removed",
    "user":req.user
  });
  }
  catch(err){
    res.status(400).send({"Error":err.message})
  }
});












module.exports = userRouter;