const movieRouter = require('express').Router();
const Movie = require('../models/Movie');
const {auth,verifyAdmin,verifyAuthOrAdmin,verifyAdminOrMovieManager}  = require('../middleware/auth');
const User = require('../models/User');


//Creating movies
movieRouter.post('/add',verifyAdminOrMovieManager,async (req,res)=>{
    const newMovie = new Movie(req.body);
    try{
        await newMovie.save();

        res.status(201).send(newMovie);
    }
    catch(err){
        res.status(400).send({
            "Error":err
        })
    }
});


//Find Movie by Id
movieRouter.get('/find/:id', async (req,res)=>{
   try{
    const movie = await  Movie.findById(req.params.id)
    if(!movie){
        return res.status(404).send("There is no movie with this id")
    }
    res.status(200).send(movie);
   }
   catch(err){
    res.status(400).send({
        "Error":err
    })
   }
})


//Get all Movies
movieRouter.get('/all', async (req,res)=>{
    try{
        const movies = await Movie.find({});
        if(!movies){
            return res.status(404).send("No movies")
        }
        res.status(200).send(movies)
    }
    catch(err){
        res.status(400).send({
            "Error":err
        })
    }
})

//Update a Movie
movieRouter.patch('/update/:id',verifyAdminOrMovieManager,async (req,res)=>{
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        if(!updatedMovie){
            return res.status(404).send("No movie with this id")
        }
        res.status(200).send(updatedMovie)
    } catch (err) {
      res.status(400).send(err);
    }
})


//Delete a Movie
movieRouter.delete('/delete/:id',verifyAdminOrMovieManager, async (req,res)=>{
    try{
        const movie  = await Movie.findByIdAndDelete(req.params.id);
        if(!movie){
            return res.status(404).send("No movie with given id")
        }
        res.status(200).send("Movie was deleted")
    }
    catch(err){
        res.status(400).send({
            "Error":err
        })
    }
})









module.exports = movieRouter;