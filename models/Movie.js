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
    }    
},{timestamps:true})

const Movie = mongoose.model("Movie",movieSchema);
module.exports = Movie;

