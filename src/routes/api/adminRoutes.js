const express = require('express');
const { AdminController } = require('../../controllers/AdminController.js');

const router = express.Router();


router.post('/create-submission', AdminController.createSubmission);
router.get('/assign-reviewer', AdminController.getArticles);
router.get('/assign-reviewer', AdminController.getReviewers);
router.post('/assign-reviewer', AdminController.assignReviewers);
router.get('/all-articles', AdminController.getAllArticles);
router.get('/remove-reviewer', AdminController.getAllReviewers);
router.delete('/remove-reviewer', AdminController.removeReviewer);

module.exports = router;
