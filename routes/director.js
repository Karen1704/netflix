const Director = require('../models/Director')
const directorRouter = require('express').Router();
const { auth, verifyAdmin, verifyAuthOrAdmin, verifyAdminOrMovieManager } = require('../middleware/auth');


directorRouter.post('/add',verifyAdmin, async (req, res) => {
    const newDirector =  new Director(req.body);
    try {
        await newDirector.save();

        res.status(201).send(newDirector)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})

module.exports = directorRouter;