const express = require('express');
const router = express.Router();
const userController = require('../controllers/password');
const userAuthenticate = require('../middleware/auth');

router.post('/forgotPassword', userController.forgotPassword);
router.get('/resetPassword/:id', userController.resetPassword);
router.get('/updatepassword/:requestId', userController.updatepassword);

module.exports = router;