const express = require('express');
const { AdminController } = require('../../controllers/AdminController.js');

const router = express.Router();

router.post('/create-submission', AdminController.createSubmission);
router.get('/admin/assign-reviewer', AdminController.getArticles);


module.exports = router;
