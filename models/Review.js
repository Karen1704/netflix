const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    comment:{
        type:String,
        required:true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    }
})

const Review = mongoose.model('Review',reviewSchema);
module.exports = Review;