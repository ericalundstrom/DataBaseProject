const { ReviewerModel } = require('../models/ReviewerModel.js');

class ReviewerController {
  static async getArticles(req, res) {
    const { filter } = req.body;
    const user = req.session.user;

    try {
      if (!user || !user.user_id) {
        throw new Error('unauthorized');
      }

      let articles = filter === 'all-assigned'
      ? ReviewerController.getAllAssignedArticles(req, res)
      : ReviewerController.getUnreviewedArticles(req, res);

      articles.then((articles) => {
        res.render('welcomeReviewer', {
          user,
          filter,
          articles,
          successMessage: null,
          errorMessage: articles.length === 0 ? 'No articles found for the current year.' : null,
        });
      })
    } catch (error) {
      res.render('welcomeReviewer', {
        user,
        filter,
        articles: [],
        successMessage: null,
        errorMessage: error.message
      });
    }
  }

  static async getAllAssignedArticles(req, res) {
    try {
      const user = req.session.user;

      if (!user || !user.user_id) {
        throw new Error('unauthorized');
      }

      const reviewer_id = user.user_id;

      const articles = await ReviewerModel.getArticlesByReviewerForCurrentYear(reviewer_id);

      return articles;
    } catch (error) {
      throw new Error('There was an error fetching the articles. Please try again later.');
    }
  }

  static async getUnreviewedArticles(req, res) {
    try {
      const user = req.session.user;

      if (!user || !user.user_id) {
        throw new Error('unauthorized');
      }

      const reviewer_id = user.user_id;

      const articles = await ReviewerModel.getUnreviewedArticlesForCurrentYear(reviewer_id);

      return articles;
    } catch (error) {
      throw new Error('There was an error fetching the articles. Please try again later.');
    }
  }

  static async review(req, res) {
    const user = req.session.user;
    const { article_id, action, filter } = req.body;

    try {
      if (!user || !user.user_id) {
        throw new Error('unauthorized');
      }

      const reviewer_id = user.user_id;
      await ReviewerModel.review(action, article_id, reviewer_id);

      let articles = filter === 'all-assigned'
      ? ReviewerController.getAllAssignedArticles(req, res)
      : ReviewerController.getUnreviewedArticles(req, res);

      articles.then((articles) => {
        res.render('welcomeReviewer', {
          user,
          filter,
          articles,
          successMessage: null,
          errorMessage: articles.length === 0 ? 'No articles found for the current year.' : null,
        });
      })
    } catch (error) {
      res.render('welcomeReviewer', {
        user,
        filter,
        articles: [],
        successMessage: null,
        errorMessage: error.message
      });
    }
  }
}

module.exports = { ReviewerController };
