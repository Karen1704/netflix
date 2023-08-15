const mongoose = require('mongoose');

const genreSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
},{timestamps:true})

// genreSchema.virtual('movies',{
//       ref:'Movie',
//       localField:'_id',
//       foreignField:'genres'  
// })

const Genre = mongoose.model('Genre',genreSchema);
module.exports = Genre; 



