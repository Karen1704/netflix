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

module.exports = actorRouter;