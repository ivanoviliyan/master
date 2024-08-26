const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/admins', userController.getAdminUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.get('/member/:member', userController.getMember)
router.delete('/:id', userController.deleteUser);
router.put('/:id/reset-email', userController.changeEmail);
router.put('/:id/reset-password', userController.resetPassword);
router.put('/:id/toggle-admin', userController.toggleAdminStatus);


module.exports = router;