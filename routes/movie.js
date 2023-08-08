const movieRouter = require('express').Router();
const Movie = require('../models/Movie');
const { auth, verifyAdmin, verifyAuthOrAdmin, verifyAdminOrMovieManager } = require('../middleware/auth');


//Creating movies
movieRouter.post('/add', verifyAdminOrMovieManager, async (req, res) => {
    const newMovie = new Movie(req.body);
    try {
        await newMovie.save();

        res.status(201).send(newMovie);
    }
    catch (err) {
        res.status(400).send({
            "Error": err.message
        })
    }
});


//Find Movie by Id
movieRouter.get('/find/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id)
        if (!movie) {
            return res.status(404).send("There is no movie with this id")
        }
        res.status(200).send(movie);
    }
    catch (err) {
        res.status(400).send({
            "Error": err.message
        })
    }
})


//Get all Movies
movieRouter.get('/all', async (req, res) => {
    try {
        const name = req.query.name;
        const year = req.query.year;
        const genre = req.query.genre;
        const director = req.query.director;
        const actor = req.query.actor;
        const country = req.query.country;
        const sortOrder = req.query.sortOrder || 'asc';
        const sortBy = req.query.sortBy;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.perPage) || 9;
        const skip = (page - 1) * limit;

        let sortCriteria = {};
        let query = {}

        // Object.keys(req.query).foreach((myQuery)=>{
        //     query[myQuery]=req.query[myQuery];
        // })



        switch (true) {
            case !!year:
                query.release_year = year                       // year && (query.release_year = year);    if (year) {query.release_year = year;}
                break;
            case !!name:
                query.name = { $regex: name, $options: "i" }    // name && (query.name = { $regex: name, $options: "i" })
                break;
            case !!director:
                query.director = director     // director && (query.director = director)
                break;
            case !!genre:
                query.genre = { $in: genre }                    // genre && (query.genre = { $in: genre });
                break
            case !!actor:
                query.actors = { $in: actor }                   // actor && (query.actors = { $in: actor })
                break
            case !!country:
                query.countries = { $in: country }              // country && (query.countries = { $in: country })
                break
        }

        if (sortBy && sortBy === 'rating') {
            sortCriteria.rating = sortOrder === 'desc' ? -1 : 1;
        } else if (sortBy && sortBy === 'name') {
            sortCriteria.name = sortOrder === 'desc' ? -1 : 1;
        } else if (sortBy && sortBy === 'year') {
            sortCriteria.release_year = sortOrder === 'desc' ? -1 : 1;
        }

        let movies;
        if (sortCriteria.length === 0) {
            movies = await Movie.find(query).skip(skip).limit(limit)
        }
        else {
            movies = await Movie.find(query).sort(sortCriteria).skip(skip).limit(limit);
        }

        if (!movies || movies.length === 0) {
            return res.status(404).send("No movies")
        }
        res.status(200).send(movies)
    }
    catch (err) {
        res.status(400).send({
            "Error": err.message
        })
    }
})

//Update a Movie
movieRouter.patch('/update/:id', verifyAdminOrMovieManager, async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        if (!updatedMovie) {
            return res.status(404).send("No movie with this id")
        }
        res.status(200).send(updatedMovie)
    } catch (err) {
        res.status(400).send(err.message);
    }
})


//Delete a Movie
movieRouter.delete('/delete/:id', verifyAdminOrMovieManager, async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.status(404).send("No movie with given id")
        }
        res.status(200).send("Movie was deleted")
    }
    catch (err) {
        res.status(400).send({
            "Error": err.message
        })
    }
})






module.exports = movieRouter;