const movieRouter = require('express').Router();
const Movie = require('../models/Movie');
const { auth, verifyAdmin, verifyAuthOrAdmin, verifyAdminOrMovieManager } = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');

//Creating movies
movieRouter.post('/add', verifyAdminOrMovieManager, async (req, res) => {
    const newMovie = new Movie(req.body);
    try {
        await newMovie.save();

        res.status(201).send(newMovie);
    }
    catch (err) {
        res.status(400).send({
            "Error": err.message``
        })
    }
});


//Find Movie by Id
movieRouter.get('/find/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id)
            .populate('genres').populate('director')
            .populate('actors').populate('countries')
            .populate({
                path:'reviews',
                populate : "owner"
            })
        if (!movie) {
            return res.status(404).send("There is no movie with this id")
        }
        const { image, video, ...others } = movie._doc;

        
        res.status(200).send(others);
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
                query.genres = { $in: genre }                    // genre && (query.genre = { $in: genre });
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
                .populate('genres')
        }
        else {
            movies = await Movie.find(query).sort(sortCriteria).skip(skip).limit(limit)
                .populate('genres')
        }

        if (!movies || movies.length === 0) {
            return res.status(404).send("No movies")
        }

        const others =[];
       for(let i=0;i<movies.length;i++){
            const {image,video, ...other} = movies[i]._doc;
            others.push(other)
       }


        res.status(200).send(others)
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
        const { image, video, ...others } = updatedMovie._doc;
        res.status(200).send(others)
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


const uploadImage = multer({
    limits: {
        fileSize: 100000,
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('Please upload an image'))
        }
        callback(undefined, true)
    }
});

movieRouter.post('/image/:id', verifyAdminOrMovieManager, uploadImage.single('image'), async (req, res) => {
    try {
        const buffer = await sharp(req.file.buffer).resize({ width: 300, height: 400 }).jpeg().toBuffer();
        const movie = await Movie.findById(req.params.id);

        movie.image = buffer;
        await movie.save();

        const{image,video, ...others} = movie._doc;
        res.status(200).send(others)

    }
    catch (err) {
        res.status(400).send({ "Error": err.message })
    }
})

//Get movie image
movieRouter.get('/image/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie.image) {
            throw new Error();
        }

        res.set("Content-Type", "image/png");
        res.status(200).send(movie.image);
    } catch (err) {
        res.status(400).send({ "Error": err.message });
    }
})


//Delete movie image

movieRouter.delete("/image/:id", verifyAdminOrMovieManager, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        movie.image = undefined;
        await movie.save();
        res.status(200).send({
            "message": "Movie image was removed",
            "movie": movie.name
        });
    }
    catch (err) {
        res.status(400).send({ "Error": err.message })
    }
});



//Movie video

const uploadVideo = multer({
    limits: {
        fileSize: 100000000,
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(mp4|avi|mkv)$/)) {
            return callback(new Error('Please upload a video'))
        }
        callback(undefined, true)
    }
});


movieRouter.post('/video/:id', verifyAdminOrMovieManager, uploadVideo.single('video'), async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        movie.video = req.file.buffer;
        await movie.save();

        res.status(200).send(movie)

    }
    catch (err) {
        res.status(400).send({ "Error": err.message })
        console.log(err)
    }
})


//Get movie video
movieRouter.get('/video/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie.video) {
            throw new Error;
        }

        // res.set("Content-Type", "video/");
        res.status(200).send(movie.video);
    } catch (err) {
        res.status(400).send({ "Error": err.message });
        console.log(err)
    }
})


movieRouter.delete("/video/:id", verifyAdminOrMovieManager, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        movie.video = undefined;
        await movie.save();
        res.status(200).send({
            "message": "Movie image was removed",
            "movie": {
                "name": movie.name,
                "id": movie._id
            },

        });
    }
    catch (err) {
        res.status(400).send({ "Error": err.message })
    }
});





module.exports = movieRouter; 