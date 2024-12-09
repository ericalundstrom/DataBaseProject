const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { successMessage: null, errorMessage: null });
});

router.get('/login', (req, res) => {
  res.render('login', { successMessage: null, errorMessage: null });
});

router.get('/author/welcome-author', (req, res) => {
  const user = req.session.user;

  if (!user) {
    return res.redirect('/login');
  }

  res.render('welcomeAuthor', { user });
});

router.get('/author/create-article', (req, res) => {
  const user = req.session.user;

  if (!user) {
    return res.redirect('/login');
  }

  res.render('createArticle', {
    user,
    successMessage: null,
    errorMessage: null
  });
});

router.get('/author/submitted-article', (req, res) => {
  const user = req.session.user;

  if (!user) {
    return res.redirect('/login');
  }

  res.render('submittedArticle', {
    user,
    articles: [],
    availableYears: [],
    selectedYear: null,
    successMessage: null,
    errorMessage: null
  });
});

router.get('/reviewer/welcome-reviewer', (req, res) => {
  const user = req.session.user;

  if (!user) {
    return res.redirect('/login');
  }

  res.render('welcomeReviewer', { user });
});

router.get('/admin/welcome-admin', (req, res) => {
  const user = req.session.user;

  if (!user) {
    return res.redirect('/login');
  }

  res.render('welcomeAdmin', { user });
});

router.get('/admin/assign-reviewer', (req, res) => {
  res.render('assignReviewer');
});

router.get('/admin/create-submission', (req, res) => {
  const user = req.session.user;

  res.render('createSubmission', {
    user,
    successMessage: null,
    errorMessage: null
  })
});

router.get('/admin/edit-submission', (req, res) => {
  const user = req.session.user;

  res.render('editSubmission', {
    user,
    submissions: [],
    successMessage: null,
    errorMessage: null
  })
});

module.exports = router;

