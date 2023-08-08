const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    }
},{timestamps:true})

const actorsSchema = new mongoose.Schema({
    actors:[actorSchema]
},{timestamps:true})


const Actors = mongoose.model('Actors', actorsSchema)
module.exports = Actors;