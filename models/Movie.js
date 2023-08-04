const mongoose = require('mongoose');


const movieSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    short_description:{
        type:String,
    },
    image:{
        type:String,
        required:true,
    },
    genre:{
        type:Array,
        required:true,
    },
    views:{
        type:Number,
        default:0,
    },
    rating:{
        type:Number,
    },
    votes:{
        type:Array,
    },
    director:{
        type:String,
    },
    actors:{
        type:Array,
    },
    release_year:{
        type:Number,
        required:true,
    },
    countries:{
        type:Array
    },
    duration:{
        type:String
    }
},{timestamps:true})

const Movie = mongoose.model("Movie",movieSchema);
module.exports = Movie;



