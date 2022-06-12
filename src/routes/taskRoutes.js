const { Router } = require('express');
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
        if (tasks.length <= 0) {
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
        if (!isValid) {
            throw new Error('You have send invalid filed to update!');
        }
        // find the task thats need to be update.
        const task = await Task.findById(req.params.id);

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

        res.status(204).json(task);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});


router.delete('/task/:id', auth, async (req, res) => {
    try {
        const result = await Task.findByIdAndDelete(req.params.id);
        if(!result) {
            throw new Error('Task already deleted!');
        }

        res.json({ msg: 'task deleted successfully.'});
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;
