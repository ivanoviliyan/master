const express = require('express');
const router = express.Router();
const userLoginController = require('../controllers/userLogin');

router.post('/', userLoginController.userLogin);

module.exports = router;