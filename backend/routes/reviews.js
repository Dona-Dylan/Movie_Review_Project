
const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Review = require('../models/Review');

const router = express.Router();

// @route   GET api/reviews/:movieName
// @desc    Get reviews for a movie
// @access  Public
router.get('/:movieName', async (req, res) => {
    try {
        const reviews = await Review.find({ movieName: req.params.movieName }).populate('reviewer', ['username']);
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/reviews
// @desc    Add a review for a movie
// @access  Private
router.post(
    '/',
    [
        auth,
        [
            check('movieName', 'Movie name is required').not().isEmpty(),
            check('rating', 'Rating is required and should be between 0 and 10').isFloat({ min: 0, max: 10 }),
            check('reviewText', 'Review text must be at least 30 words').isLength({ min: 30 })
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { movieName, rating, reviewText } = req.body;

        try {
            const review = new Review({
                movieName,
                rating,
                reviewText,
                reviewer: req.user.id
            });

            await review.save();

            const user = await User.findById(req.user.id);
            user.reviews.push(review);
            await user.save();

            res.json(review);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;
