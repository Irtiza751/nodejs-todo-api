const { Router } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middlewares/auth');
const router = Router();

router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
        user.token = token;

        res.status(201).json(user);
    } catch (error) {
        res.status(401).json({ msg: error.message });
        console.log(error);
    }
});

router.patch('/me', auth, async (req, res) => {
    const validFields = ['username', 'email'];
    const updates = Object.keys(req.body)
    const fieldsAreValid = updates.every((field, i) => validFields[i] === field);

    try {
        if (!fieldsAreValid) {
            throw new Error('You entered invalid field');
        }

        const user = await User.findById(req.userId);
        updates.forEach(update => user[update] = req.body[update]);

        await user.save();
        res.json({msg: 'Profile successfully updated!'});
    } catch (error) {
        res.status(401).json({ msg: error.message });
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.userId })
        const { username, email, id } = user;
        res.json({ username, email, id });
    } catch (error) {
        res.status(400).json({ msg: 'Something went wrong.' })
    }
});

module.exports = router;