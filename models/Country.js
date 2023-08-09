const mongoose = require('mongoose');

const countrySchema  = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
},{timestamps:true})

countrySchema.virtual('movies',{
      ref:'Movie',
      localField:'_id',
      foreignField:'countries'  
})

const Country = mongoose.model('Country',countrySchema);
module.exports = Country; 



