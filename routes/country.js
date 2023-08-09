const Country = require('../models/Country')
const countryRouter = require('express').Router();
const { auth, verifyAdmin, verifyAuthOrAdmin, verifyAdminOrMovieManager } = require('../middleware/auth');


countryRouter.post('/add', verifyAdminOrMovieManager, async (req, res) => {
    const newCountry = new Country(req.body);
    try {
        await newCountry.save();

        res.status(201).send(newCountry)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})




//Find genre by Id
countryRouter.get('/find/:id', async (req, res) => {
    try {
        const country = await Country.findById(req.params.id)
        if (!country) {
            return res.status(404).send("There is no country with given id")
        }
        res.status(200).send(country);
    }
    catch (err) {
        res.status(400).send({
            "Error": err.message
        })
    }
})


countryRouter.get('/all', async (req, res) => {
    try {
        const countries = await Country.find({})
        if (!countries) {
            return res.status(404).send("There is no country")
        }
        res.status(200).send(countries);
    }
    catch (err) {
        res.status(400).send({
            "Error": err.message
        })
    }
}
)





countryRouter.patch('/update/:id', verifyAdminOrMovieManager, async (req, res) => {
    try {
        const updatedCountry = await Country.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        if (!updatedCountry) {
            return res.status(404).send("No country with this id")
        }
        res.status(200).send(updatedCountry)
    } catch (err) {
        res.status(400).send(err.message);
    }
})


countryRouter.delete('/delete/:id', verifyAdminOrMovieManager, async (req, res) => {
    try {
        const country = await Country.findByIdAndDelete(req.params.id);
        if (!country) {
            return res.status(404).send("No country with given id")
        }
        res.status(200).send("country was deleted")
    }
    catch (err) {
        res.status(400).send({
            "Error": err.message
        })
    }
})


module.exports = countryRouter;