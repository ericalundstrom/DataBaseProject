const { ReviewerModel } = require('../models/ReviewerModel.js');

class ReviewerController {
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
}

module.exports = { ReviewerController };
