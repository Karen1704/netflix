const mongoose = require('mongoose');

const genreSchema  = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
})

genreSchema.virtual('movies',{
      ref:'Movie',
      localField:'_id',
      foreignField:'genres'  
})

const Genre = mongoose.model('Genre',genreSchema);
module.exports = Genre; 



