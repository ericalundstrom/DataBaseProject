const express = require('express');
const router = express.Router();
const { AuthorController } = require('../../controllers/authorController.js');
const { AdminController } = require('../../controllers/adminController.js');

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

  AuthorController.getSubmissionPeriod(req, res)
  .then(({ submissionStartDate, submissionEndDate }) => {
    res.render('createArticle', {
      user,
      successMessage: null,
      errorMessage: null,
      submissionStartDate,
      submissionEndDate,
    });
  })
  .catch((error) => {
    let errorMessage;

    if (error.message === 'unauthorized') {
      errorMessage = 'You must be logged in to access this page.';
    } else if (error.message === 'noActiveSubmissionPeriod') {
      errorMessage = 'No active submission period found.';
    }
    res.render('createArticle', {
      user,
      successMessage: null,
      errorMessage: 'Error fetching submission period'
    });
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
  const user = req.session.user;

  if (!user) {
    return res.redirect('/login');
  }

  AdminController.getArticles(req, res)
  .then(({ articles }) => {
    res.render('assignReviewer', {
      user,
      articles,
      successMessage: null,
      errorMessage: null
    });
  })
  .catch((error) => {
    let errorMessage;

    if (error.message === 'unauthorized') {
      errorMessage = 'You must be logged in to access this page.';
    } else if (error.message === 'noArticlesFound') {
      errorMessage = 'No articles found.';
    }
    res.render('assignReviewer', {
      user,
      articles,
      successMessage: null,
      errorMessage: 'Error fetching articles'
    });
  });
});

router.get('/admin/create-submission', (req, res) => {
  const user = req.session.user;

  res.render('createSubmission', {
    user,
    successMessage: null,
    errorMessage: null
  })
});

module.exports = router;

