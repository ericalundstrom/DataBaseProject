const express = require('express');
const { ReviewerController } = require('../../controllers/reviewerController.js');

const router = express.Router();

router.post('/select-filter', ReviewerController.getArticles);
router.post('/review', ReviewerController.review);
router.post('/save-comment', ReviewerController.saveComment);

module.exports = router;
