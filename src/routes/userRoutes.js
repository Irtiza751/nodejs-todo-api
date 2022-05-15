const { Router } = require('express');
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

module.exports = router;