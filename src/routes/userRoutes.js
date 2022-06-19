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
        // console.log(error.message);
        res.status(400).json({ msg: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {expiresIn: "7d"});
        user.token = token;

        res.status(201).json(user);
    } catch (error) {
        res.status(401).json({ msg: error.message });
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if(!user) {
            throw new Error('User doest not exist');
        }
        delete user.token;
        await user.save();
        
        console.log(user);
        res.json({msg: 'You are loged out'});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
});

router.patch('/me', auth, async (req, res) => {
    const validFields = ['username', 'email'];
    const updates = Object.keys(req.body)
    const fieldsAreValid = updates.every(field => validFields.includes(field));

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

router.delete('/me', auth, async (req, res) => {
    try {
        await User.deleteOne({_id: req.userId});
        
        res.json({msg: 'Your account is deleted successfully!'});
    } catch(error) {
        res.status(400).json({msg: 'something went wrong!'});
    }
});

module.exports = router;
