const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    }
},{timestamps:true})





actorSchema.virtual('movies',{
    ref:'Movie',
    localField:'_id',
    foreignField:'actors'
})

const Actor = mongoose.model('Actor', actorSchema);
module.exports = Actor


 