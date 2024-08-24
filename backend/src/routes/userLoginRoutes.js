const express = require('express');
const router = express.Router();
const userLoginController = require('../controllers/userLogin'); // Make sure this path is correct

router.post('/', userLoginController.userLogin);
router.post('/register', userLoginController.createUser);

module.exports = router;