const mongoose = require('mongoose');

/**
* @TODO
* Make simple task data modle and export.
*/
const TaskSchema = new mongoose.Schema({
  title: {type: String, required: true},
  body: {type: String, required: false},
  isDone: {type: Boolean, default: false},
  owner: {type: mongoose.Schema.Type.ObjectId, required: true},
}, {timestamps: true});

module.exports = mongoose.model('Task', TaskSchema);
