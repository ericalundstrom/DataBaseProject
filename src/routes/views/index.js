const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { successMessage: null, errorMessage: null });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/author/create-article', (req, res) => {
  res.render('createArticle');
});

router.get('/author/submitted-article', (req, res) => {
  res.render('submittedArticle');
});

module.exports = router;
