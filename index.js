const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const userRouter = require('./routes/user');

dotenv.config();




mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(()=>console.log("Database Connected Successfully!"))
    .catch((err)=>console.log(err))


const app = express();
app.use(express.json());


app.use('/api/users',userRouter);



app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server is running");
})


