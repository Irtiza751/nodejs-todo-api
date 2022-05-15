const { Router } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = Router();

router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
        user.token = token;
        
        res.status(201).json(user);
    } catch (error) {
        res.status(401).json({msg: error.message});
        console.log(error);
    }
})

module.exports = router;