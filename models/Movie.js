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
    inWishlist:{
        type:Boolean,
        default:false
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
    },
    image:{
        type:Buffer,
    },
    image_url:{
        type:String
    },
    video:{
        type:Buffer
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }]

},{timestamps:true})



// movieSchema.virtual("reviews", {
//     ref: "Review",
//     localField: "_id",
//     foreignField: "movie",
//   });
  




//   movieSchema.index({ 'reviews.owner': 1, 'reviews.vote': 1 });


const Movie = mongoose.model("Movie",movieSchema);
module.exports = Movie;



