const { connectDatabase } = require('../utils/database.js');

class ReviewerModel {
  static async getArticlesByReviewerForCurrentYear(reviewer_id) {
    const client = await connectDatabase();

    try {
      const currentYear = new Date().getFullYear();
      const query = `
        SELECT a.*, ar.decision FROM articles a
        JOIN Article_Reviewers_Table ar ON a.article_id = ar.article_id
        WHERE ar.reviewer_id = $1
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
        JOIN Article_Reviewers_Table ar ON a.article_id = ar.article_id
        WHERE ar.reviewer_id = $1
          AND ar.decision = 'under review'
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
      client.end();
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
}

module.exports = { ReviewerModel };
