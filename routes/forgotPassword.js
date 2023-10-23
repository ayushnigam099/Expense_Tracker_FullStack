const express = require('express');

const forgotPasswordController = require('../controllers/forgotPassword')

const router = express.Router();

router.post('/forgotpassword',forgotPasswordController.forgotPassword )
router.get(
    "/resetPassword/:requestId",
    forgotPasswordController.resetPassword
  );
  router.post("/updatePassword", forgotPasswordController.updatePassword);
  
module.exports = router;