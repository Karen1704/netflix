const mongoose = require('mongoose');

const genreSchema  = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
})

const Genre = mongoose.model('Genre',genreSchema);
module.exports = Genre; 



