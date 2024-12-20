const express = require('express');
const { AuthorController } = require('../../controllers/authorController.js');

const router = express.Router();

router.get('/submission-period', AuthorController.getSubmissionPeriod);
router.post('/create-article', AuthorController.createArticle);
router.post('/submitted-article', AuthorController.getSubmittedArticle);

module.exports = router;
