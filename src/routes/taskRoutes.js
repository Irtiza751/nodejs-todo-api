const { Router } = require('express');
const req = require('express/lib/request');
const auth = require('../middlewares/auth');
const Task = require('../models/Task');

const router = Router();

router.post('/task', auth, async (req, res) => {
    try {
        const task = new Task({ ...req.body, owner: req.userId });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).send('Something went wrong!');
    }
});

router.get('/task', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.userId });
        if (tasks.length) {
            return res.json({ msg: 'You have no tasks!' });
        }
        res.json(tasks);
    } catch (error) {
        res.status(401).json({ msg: error.message });
    }
});

router.get('/task/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.json({ msg: 'No task found!' });
        }
        res.json(task);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

router.patch('/task/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const validUpdates = ['title', 'body', 'isDone'];

    const isValid = updates.every(update => validUpdates.includes(update));
    try {
        console.log(isValid);
        if (!isValid) {
            throw new Error('You have send invalid filed to update!');
        }
        res.send(isValid);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;