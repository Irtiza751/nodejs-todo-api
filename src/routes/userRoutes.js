const { Router } = require('express');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const userController = require('../controllers/userController');
// init router
const router = Router();

router.post('/register', upload.single('avatar'), userController.registerUser);

router.post('/login', userController.loginUser);

router.post('/logout', auth, userController.logoutUser);

router.patch('/me', auth, upload.single('avatar'), userController.updateProfile);

router.get('/me', auth, userController.getProfile);

router.delete('/me', auth,);

module.exports = router;
