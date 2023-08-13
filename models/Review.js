const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    comment:{
        type:String,
        required:true
    },
    vote:{
        type:String,
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
})

const Review = mongoose.model('Review',reviewSchema);
module.exports = Review;