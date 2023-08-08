const Actor = require('../models/Actor')
const actorRouter = require('express').Router();
const { auth, verifyAdmin, verifyAuthOrAdmin, verifyAdminOrMovieManager } = require('../middleware/auth');


actorRouter.post('/add', verifyAdmin, async (req, res) => {
    const newActor = new Actor(req.body);
    try {
        await newActor.save();

        res.status(201).send(newActor)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})




//Find actor by Id
actorRouter.get('/find/:id', async (req, res) => {
    try {
        const actor = await Actor.findById(req.params.id)
        if (!actor) {
            return res.status(404).send("There is no actor with given id")
        }
        res.status(200).send(actor);
    }
    catch (err) {
        res.status(400).send({
            "Error": err.message
        })
    }
})


actorRouter.get('/all', async (req, res) => {
    try {
        const actors = await Actor.find({})
        if (!actors) {
            return res.status(404).send("There is no actor")
        }
        res.status(200).send(actors);
    }
    catch (err) {
        res.status(400).send({
            "Error": err.message
        })
    }
}
)





actorRouter.patch('/update/:id', verifyAdminOrMovieManager, async (req, res) => {
    try {
        const updatedActor = await Actor.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        if (!updatedActor) {
            return res.status(404).send("No actor with this id")
        }
        res.status(200).send(updatedActor)
    } catch (err) {
        res.status(400).send(err.message);
    }
})


actorRouter.delete('/delete/:id', verifyAdminOrMovieManager, async (req, res) => {
    try {
        const actor = await Actor.findByIdAndDelete(req.params.id);
        if (!actor) {
            return res.status(404).send("No actor with given id")
        }
        res.status(200).send("actor was deleted")
    }
    catch (err) {
        res.status(400).send({
            "Error": err.message
        })
    }
})


module.exports = actorRouter;