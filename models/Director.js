const mongoose = require('mongoose');

const directorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
},{timestamps:true})

directorSchema.virtual('movies',{
    ref:'Movie',
    localField:'name',
    foreignField:'director'
})


const Director = mongoose.model("Director",directorSchema);
module.exports = Director;  