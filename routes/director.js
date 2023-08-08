const Director = require('../models/Director')
const directorRouter = require('express').Router();
const { auth, verifyAdmin, verifyAuthOrAdmin, verifyAdminOrMovieManager } = require('../middleware/auth');


directorRouter.post('/add', verifyAdmin, async (req, res) => {
    const newDirector = new Director(req.body);
    try {
        await newDirector.save();

        res.status(201).send(newDirector)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})

//Find Director by Id
directorRouter.get('/find/:id', async (req, res) => {
    try {
        const director = await Director.findById(req.params.id)
        if (!director) {
            return res.status(404).send("There is no director with given id")
        }
        res.status(200).send(director);
    }
    catch (err) {
        res.status(400).send({
            "Error": err.message
        })
    }
})


directorRouter.get('/all', async (req, res) => {
    try {
        const directors = await Director.find({})
        if (!directors) {
            return res.status(404).send("There is no director")
        }
        res.status(200).send(directors);
    }
    catch (err) {
        res.status(400).send({
            "Error": err.message
        })
    }
}
)





directorRouter.patch('/update/:id', verifyAdminOrMovieManager, async (req, res) => {
    try {
        const updatedDirector = await Director.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        if (!updatedDirector) {
            return res.status(404).send("No movie with this id")
        }
        res.status(200).send(updatedDirector)
    } catch (err) {
        res.status(400).send(err.message);
    }
})


directorRouter.delete('/delete/:id', verifyAdminOrMovieManager, async (req, res) => {
    try {
        const director = await Director.findByIdAndDelete(req.params.id);
        if (!director) {
            return res.status(404).send("No movie with given id")
        }
        res.status(200).send("Director was deleted")
    }
    catch (err) {
        res.status(400).send({
            "Error": err.message
        })
    }
})

module.exports = directorRouter;