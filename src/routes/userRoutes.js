const { Router } = require('express');
const auth = require('../middlewares/auth');
const router = Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);

router.post('/logout', auth, userController.logoutUser);

router.patch('/me', auth, userController.updateProfile);

router.get('/me', auth, userController.getProfile);

router.delete('/me', auth, );

module.exports = router;
