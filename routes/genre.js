const Genre = require('../models/Genre')
const genreRouter = require('express').Router();
const { auth, verifyAdmin, verifyAuthOrAdmin, verifyAdminOrMovieManager } = require('../middleware/auth');


genreRouter.post('/add', verifyAdmin, async (req, res) => {
    const newGenre = new Genre(req.body);
    try {
        await newGenre.save();

        res.status(201).send(newGenre)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})




//Find genre by Id
genreRouter.get('/find/:id', async (req, res) => {
    try {
        const genre = await Genre.findById(req.params.id)
        if (!genre) {
            return res.status(404).send("There is no genre with given id")
        }
        res.status(200).send(genre);
    }
    catch (err) {
        res.status(400).send({
            "Error": err.message
        })
    }
})


genreRouter.get('/all', async (req, res) => {
    try {
        const genres = await Genre.find({})
        if (!genres) {
            return res.status(404).send("There is no genre")
        }
        res.status(200).send(genres);
    }
    catch (err) {
        res.status(400).send({
            "Error": err.message
        })
    }
}
)





genreRouter.patch('/update/:id', verifyAdminOrMovieManager, async (req, res) => {
    try {
        const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        if (!updatedGenre) {
            return res.status(404).send("No genre with this id")
        }
        res.status(200).send(updatedGenre)
    } catch (err) {
        res.status(400).send(err.message);
    }
})


genreRouter.delete('/delete/:id', verifyAdminOrMovieManager, async (req, res) => {
    try {
        const genre = await Genre.findByIdAndDelete(req.params.id);
        if (!genre) {
            return res.status(404).send("No genre with given id")
        }
        res.status(200).send("genre was deleted")
    }
    catch (err) {
        res.status(400).send({
            "Error": err.message
        })
    }
})


module.exports = genreRouter;