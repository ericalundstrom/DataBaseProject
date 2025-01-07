const { connectDatabase } = require('../utils/database.js');

class ReviewerModel {
  static async getArticlesByReviewer(reviewer_id) {
    const client = await connectDatabase();

    try {
      const query = `
        SELECT a.*, ar.decision FROM articles a
        JOIN Article_Reviewers_Table ar ON a.article_id = ar.article_id
        WHERE ar.reviewer_id = $1
        ORDER BY a.submission_date DESC;
      `;
      const values = [reviewer_id];

      const result = await client.query(query, values);

      return result.rows;
    } catch (error) {
      throw new Error('Error fetching articles for the reviewer');
    } finally {
      client.release();
    }
  }

  static async getUnreviewedArticles(reviewer_id) {
    const client = await connectDatabase();

    try {
      const query = `
        SELECT a.* FROM articles a
        JOIN Article_Reviewers_Table ar ON a.article_id = ar.article_id
        WHERE ar.reviewer_id = $1
          AND ar.decision = 'under review'
        ORDER BY a.submission_date DESC;
      `;
      const values = [reviewer_id];

      const result = await client.query(query, values);

      return result.rows;
    } catch (error) {
      throw new Error('Error fetching articles for the reviewer');
    } finally {
      client.release();
    }
  }

  static async review(action, article_id, reviewer_id) {
    const client = await connectDatabase();

    try {
      await client.query('BEGIN');

      const query = `
        UPDATE article_reviewers_table
        SET decision = $1
        WHERE article_id = $2 AND reviewer_id = $3;
      `;

      const values = [action, article_id, reviewer_id];
      await client.query(query, values);

      if (action === 'rejected') {
        await ReviewerModel.rejectArticleStatus(client, reviewer_id);
      } else if (action === 'accepted') {
        await ReviewerModel.acceptArticleStatus(client, article_id);
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async rejectArticleStatus(client, reviewer_id) {
    const query = `
      UPDATE articles
      SET article_status = 'rejected'
      FROM Article_Reviewers_Table ar
      WHERE articles.article_id = ar.article_id
        AND ar.reviewer_id = $1
        AND ar.decision = 'rejected';
    `;

    await client.query(query, [reviewer_id]);
  }

  static async acceptArticleStatus(client, article_id) {
    try {
      const checkQuery = `
        SELECT COUNT(*) AS total_reviewers,
          SUM(CASE WHEN decision = 'accepted' THEN 1 ELSE 0 END) AS accepted_reviewers
        FROM Article_Reviewers_Table
        WHERE article_id = $1;
      `;

      const checkResult = await client.query(checkQuery, [article_id]);
      const { total_reviewers, accepted_reviewers } = checkResult.rows[0];

      if (parseInt(total_reviewers) === parseInt(accepted_reviewers)) {
        const updateQuery = `
          UPDATE articles
          SET article_status = 'accepted'
          WHERE article_id = $1;
        `;

        await client.query(updateQuery, [article_id]);
      }
    } catch (error) {
      throw new Error(`Error while updating article status for article_id: ${article_id} - ${error.message}`);
    }
  }

  static async saveComment(articleId, reviewerId, comment) {
    const client = await connectDatabase();

    try {
      const query = `
        UPDATE Article_Reviewers_Table
        SET comment = $1
        WHERE article_id = $2 AND reviewer_id = $3;
      `;

      const values = [comment, articleId, reviewerId];
      await client.query(query, values);
    } catch (error) {
      throw new Error('Error saving comment to the database');
    } finally {
      client.release();
    }
  }
}

module.exports = { ReviewerModel };
