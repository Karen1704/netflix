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
    genres:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Genre'
    }],
    views:{
        type:Number,
        default:0,
    },
    rating:{
        type:Number,
        default:0,
        max:10
    },
    votes:{
        type:Array,
    },
    director:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Director'
    },
    actors:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Actor"
    }],
    release_year:{
        type:Number,
        required:true,
    },
    countries:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Country"
    }],
    duration:{
        type:String,
        required:true
    }
},{timestamps:true})

const Movie = mongoose.model("Movie",movieSchema);
module.exports = Movie;



