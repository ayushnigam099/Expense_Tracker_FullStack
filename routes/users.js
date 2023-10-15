const express = require('express');

const userController = require('../controllers/users');

const router = express.Router();

router.post('/signup', userController.signup);

router.post('/signin', userController.signin)
module.exports = router;