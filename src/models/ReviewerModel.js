const { connectDatabase } = require('../utils/database.js');

class ReviewerModel {
  static async getArticlesByReviewerForCurrentYear(reviewer_id) {
    const client = await connectDatabase();

    try {
      const currentYear = new Date().getFullYear();
      const query = `
        SELECT a.* FROM articles a
        JOIN Article_Reviewers_Table article_reviewers ON a.article_id = article_reviewers.article_id
        WHERE article_reviewers.reviewer_id = $1
        AND EXTRACT(YEAR FROM a.submission_date) = $2
        ORDER BY a.submission_date DESC;
      `;
      const values = [reviewer_id, currentYear];

      const result = await client.query(query, values);

      return result.rows;
    } catch (error) {
      throw new Error('Error fetching articles for the reviewer');
    } finally {
      client.end();
    }
  }

  static async getUnreviewedArticlesForCurrentYear(reviewer_id) {
    const client = await connectDatabase();

    try {
      const currentYear = new Date().getFullYear();
      const query = `
        SELECT a.* FROM articles a
        JOIN Article_Reviewers_Table article_reviewers ON a.article_id = article_reviewers.article_id
        WHERE article_reviewers.reviewer_id = $1
        AND a.article_status = 'under review'
        AND EXTRACT(YEAR FROM a.submission_date) = $2
        ORDER BY a.submission_date DESC;
      `;
      const values = [reviewer_id, currentYear];

      const result = await client.query(query, values);

      return result.rows;
    } catch (error) {
      throw new Error('Error fetching articles for the reviewer');
    } finally {
      client.end();
    }
  }

  static async review(action) {
    try {
      await client.query(query, values);
    } catch (error) {
      throw error;
    } finally {
      client.end();
    }
  }
}

module.exports = { ReviewerModel };
