const express = require('express');
const { AdminController } = require('../../controllers/AdminController.js');
const { ManageController } = require('../../controllers/manageController.js');

const router = express.Router();


router.post('/create-submission', AdminController.createSubmission);
router.get('/assign-reviewer', AdminController.getArticlesToAssignReviewer);
router.post('/assign-reviewer', AdminController.assignReviewers);
router.get('/all-articles', AdminController.getAllArticles);
router.get('/remove-reviewer', AdminController.getAllReviewers);
router.delete('/remove-reviewer', AdminController.removeReviewer);
router.post('/add-reviewer', ManageController.register);

module.exports = router;
