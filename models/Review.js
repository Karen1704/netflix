const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    comment:{
        type:String,
    },
    vote:{
        type:Number,
    },
    movie:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Movie"
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    }
},{timestamps:true})



const Review = mongoose.model('Review',reviewSchema);
module.exports = Review;