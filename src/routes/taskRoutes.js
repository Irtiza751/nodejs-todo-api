const { Router } = require('express');
const taskController = require('../controllers/taskController');
const auth = require('../middlewares/auth');

const router = Router();

router.post('/task', auth, taskController.createTask);

router.get('/task', auth, taskController.getAllTask);

router.get('/task/:id', auth, taskController.getSingleTask);

router.patch('/task/:id', auth, taskController.updateTask);

router.delete('/task/:id', auth, taskController.deleteTask);

// setting up delete task route
// router.delete('/task/:id', auth, async (req, res) => {})
/**
@TODO: create a feature & experiment branches to organize and manage codebase 😊.
*/
module.exports = router;
