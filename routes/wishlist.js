const Wishlist = require('../models/Wishlist')
const wishlistRouter = require('express').Router();
const { auth, verifyAdmin, verifyAuthOrAdmin, verifyAdminOrMovieManager } = require('../middleware/auth');


wishlistRouter.post('/create', auth, async (req, res) => {
    const newWishlist = new Wishlist({
        ...req.body,
        owner:req.user._id
    });
    try {
        await newWishlist.save();

        res.status(201).send(newWishlist)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})

wishlistRouter.get('/open', auth, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({owner:req.user._id}).populate('movies')
        

        wishlist.movies.forEach((movie)=>{
        movie.image = undefined;
        movie.video = undefined;
       })
    


        res.status(200).send(wishlist)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})

wishlistRouter.post('/add-movie', auth, async (req,res)=>{
    try{

        const updatedWishlist = await Wishlist.findOneAndUpdate(
            { owner: req.user._id },
            { $push: { movies: req.body.movie } },
            { new: true }
          );
        

        res.status(200).send(updatedWishlist);

    }
    catch (err) {
        res.status(400).send(err.message)
    }
})

wishlistRouter.delete('/remove-movie', auth, async (req,res)=>{
    try{

        const updatedWishlist = await Wishlist.findOneAndUpdate(
            { owner: req.user._id },
            { $pull: { movies: req.body.movie } },
            { new: true }
          );
        

        res.status(200).send(updatedWishlist);

    }
    catch (err) {
        res.status(400).send(err.message)
    }
})








module.exports = wishlistRouter;