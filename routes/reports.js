const express = require('express');

const reportsController = require('../controllers/reports');

const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/dailyreport', authenticatemiddleware.authenticate, reportsController.dailyreport);

router.post('/monthreport', authenticatemiddleware.authenticate, reportsController.monthreport);

router.get('/download', authenticatemiddleware.authenticate, reportsController.downloadreport);

module.exports = router;