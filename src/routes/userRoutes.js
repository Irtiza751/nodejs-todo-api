const { Router } = require('express');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const userController = require('../controllers/userController');
// init router
const router = Router();


router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);

router.post('/logout', auth, userController.logoutUser);

router.post('/avatar', auth, upload.single('avatar'), userController.uploadAvatar);

router.patch('/me', auth, userController.updateProfile);

router.get('/me', auth, userController.getProfile);

router.delete('/me', auth,);

module.exports = router;
