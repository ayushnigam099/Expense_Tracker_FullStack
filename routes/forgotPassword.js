const express = require('express');

const forgotPasswordController = require('../controllers/forgotPassword')

const router = express.Router();

router.post('/forgotpassword',forgotPasswordController.forgotPassword )
module.exports = router;