const Task = require('../models/Task');

module.exports = {
  createTask: async (req, res) => {
    try {
      const task = new Task({ ...req.body, owner: req.userId });
      await task.save();
      res.status(201).json(task);
    } catch (error) {
      res.status(400).send('Something went wrong!');
    }
  },

  // api/task?compeleted=(true/false)&&sort=(assc/desc)
  getAllTask: async (req, res) => {
    console.log(req.query);
    try {
      // sort by (condition)
      const sortBy = req.query.sort === 'desc' ? '-title' : 'title';
      // filter query
      const match = {};
      if(req.query.isDone) {
        match.isDone = req.query.isDone === 'true';
      }

      const tasks = await Task.find({ owner: req.userId, ...match })
        .limit(Number(req.query.limit))
        .skip(Number(req.query.skip))
        .sort(sortBy);
        
      res.json(tasks);
    } catch (error) {
      res.status(401).json({ msg: error.message });
    }
  },

  getSingleTask: async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.json({ msg: 'No task found!' });
      }
      res.json(task);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },

  updateTask: async (req, res) => {
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
  },

  deleteTask: async (req, res) => {
    try {
      const result = await Task.findByIdAndDelete(req.params.id);
      if (!result) {
        throw new Error('Task already deleted!');
      }

      res.json({ msg: 'task deleted successfully.' });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }
}