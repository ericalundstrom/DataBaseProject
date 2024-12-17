const express = require('express');
const router = express.Router();
const { AuthorController } = require('../../controllers/authorController.js');
const { AdminController } = require('../../controllers/adminController.js');
const { ReviewerController } = require('../../controllers/reviewerController.js');

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

  ReviewerController.getAllAssignedArticles(req, res)
  .then((articles) => {
    res.render('welcomeReviewer', {
      user,
      filter: 'all-assigned',
      articles,
      successMessage: null,
      errorMessage: articles.length === 0 ? 'No articles found for the current year.' : null,
    });
  }).catch((error) => {
     res.render('welcomeReviewer', {
        user,
        filter: 'all-assigned',
        articles: [],
        successMessage: null,
        errorMessage: error.message
      });
   });
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
    // När artiklar hämtats, hämta reviewers
    AdminController.getReviewers(req, res)
      .then(({ reviewers }) => {
        // Rendera vyn när både artiklar och reviewers har hämtats
        res.render('assignReviewer', {
          user,
          articles,
          reviewers,
          successMessage: null,
          errorMessage: null
        });
      })
      .catch((reviewerError) => {
        // Om ett fel inträffar vid hämtning av reviewers
        let errorMessage = 'Error fetching reviewers';
        if (reviewerError.message === 'unauthorized') {
          errorMessage = 'You must be logged in to access this page.';
        }

        res.render('assignReviewer', {
          user,
          articles, // Artiklar hämtades framgångsrikt, skickas med
          reviewers: [], // Ingen reviewer-data att skicka
          successMessage: null,
          errorMessage
        });
      });
  })
  .catch((articleError) => {
    // Om ett fel inträffar vid hämtning av artiklar
    let errorMessage = 'Error fetching articles';
    if (articleError.message === 'unauthorized') {
      errorMessage = 'You must be logged in to access this page.';
    } else if (articleError.message === 'noArticlesFound') {
      errorMessage = 'No articles found.';
    }

    res.render('assignReviewer', {
      user,
      articles: [], // Ingen artikeldata att skicka
      reviewers: [], // Ingen reviewer-data att skicka
      successMessage: null,
      errorMessage
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

router.get('/admin/add-reviewer', (req, res) => {
  const user = req.session.user;

  res.render('addReviewer', {
    user,
    successMessage: null,
    errorMessage: null
  })
})

router.get('/admin/remove-reviewer', (req, res) => {
  const user = req.session.user;
  AdminController.getAllReviewers(req, res)
  .then(({ reviewers }) => {
    // Rendera vyn när både artiklar och reviewers har hämtats
    res.render('removeReviewer', {
      user,
      reviewers,
      successMessage: null,
      errorMessage: null
    });
  })
  .catch((reviewerError) => {
    // Om ett fel inträffar vid hämtning av reviewers
    let errorMessage = 'Error fetching reviewers';
    if (reviewerError.message === 'unauthorized') {
      errorMessage = 'You must be logged in to access this page.';
    }

    res.render('removeReviewer', {
      user,
      successMessage: null,
      errorMessage
    });
  });
})

router.delete('/remove-reviewer', async (req, res) => {
  try {
    const { reviewer_id } = req.body; 
    if (!reviewer_id) {
      return res.status(400).render('removeReviewer', {
        errorMessage: 'Reviewer ID is missing',
        successMessage: null,
        reviewers: []
      });
    }

    await AdminController.removeReviewer(req, res);
  } catch (error) {
    console.error('Error removing reviewer:', error);
    res.status(500).render('removeReviewer', {
      errorMessage: 'An error occurred while removing the reviewer',
      successMessage: null,
      reviewers: []
    });
  }
});

router.get('/admin/all-articles', (req, res) => {
  const user = req.session.user;

  if (!user) {
    return res.redirect('/login');
  }

  const searchQuery = req.query.query;
  const year = req.query.year;

  AdminController.getAllArticles(req, res)
  .then(({ articles, years }) => {
    res.render('allArticles', {
      user,
      articles,
      years, 
      year, 
      successMessage: null,
      errorMessage: null,
      searchQuery
    });
  })
  .catch((error) => {
    let errorMessage;
    if (error.message === 'unauthorized') {
      errorMessage = 'You must be logged in to access this page.';
    } else if (error.message === 'noArticlesFound') {
      errorMessage = 'No articles found.';
    }
    res.render('allArticles', {
      user,
      articles: [],
      years: [],
      year, 
      successMessage: null,
      errorMessage: 'Error fetching articles',
      searchQuery: ''
    });
  });

})

router.post('/admin/all-articles', async (req, res) => {
  const user = req.session.user;

  if (!user) {
    return res.redirect('/login');
  }

  const searchQuery = req.body.query || '';
  const year = req.query.year || null;

  
  try {

    const { articles, years } = await AdminController.searchArticles(searchQuery, year);
    res.render('allArticles', {
      user,
      articles,
      years,
      year,
      successMessage: null,
      errorMessage: null,
      searchQuery
    });
  } catch (error) {
    res.render('allArticles', {
      user,
      articles: [],
      years: [],
      year,
      successMessage: null,
      errorMessage: 'Error fetching articles',
      searchQuery
    });
  }
});


module.exports = router;

