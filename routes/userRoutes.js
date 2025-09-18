const express = require('express');
const authController = require('../controllers/authcontroller');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword', authController.resetPassword);

// routes after this middleware are protected, user must be logged in to access them
router.use(authController.protect);
router.patch('/updateMyPasword', authController.updatePassword);
router.get('/me', userController.getMe);
router.patch('updateMe', userController.updateMe);
router.delete('deleteMe', userController.deleteMe);

// all routes after this point can inly be accessed by an admin
router.use(authController.restrictTo('admin'));

router.get('/', userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
