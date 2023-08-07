const mongoose = require('mongoose');

const directorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})

directorSchema.virtual('movies',{
    ref:'Movie',
    localField:'_id',
    foreignField:'director.name'
})


const Director = mongoose.model("Director",directorSchema);
module.exports = Director;  