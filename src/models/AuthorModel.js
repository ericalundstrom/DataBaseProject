const { connectDatabase } = require('../utils/database.js');

class AuthorModel {
  static async getLatestSubmissionPeriod() {
    const client = await connectDatabase();

    try {
        const query = `
            SELECT start_date, end_date, year
            FROM submissionperiods
            WHERE EXTRACT(YEAR FROM start_date) = EXTRACT(YEAR FROM CURRENT_DATE)
            ORDER BY start_date DESC
            LIMIT 1;
        `;

        const result = await client.query(query);

        return result.rows[0] || null;
    } catch (error) {
        console.error('Error fetching active submission period:', error);
        throw new Error('Could not fetch active submission period');
    } finally {
        client.release();
    }
  }

  static async createArticle(author_id, title, article_type, keywords, article_status, content, submission_date) {
    const client = await connectDatabase();

    try {
      const newArticleId = await this.generateArticleId(client);

      const query = 'INSERT INTO articles (article_id, author_id, title, article_type, keywords, content, article_status, submission_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';

      const values = [newArticleId, author_id, title, article_type, keywords, content, article_status, submission_date];

      await client.query(query, values);

      return { title, article_type, keywords, content, submission_date };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  static async generateArticleId(client) {
    try {
      const result = await client.query('SELECT MAX(article_id) AS max_id FROM articles');
      const maxId = result.rows[0].max_id || 0;
      return maxId + 1;
    } catch (error) {
      console.error('Error at generating ID:', error);
      throw new Error('Could not generate a unique article ID');
    }
  }

  static async getArticlesByAuthorAndYear(author_id, year) {
    const client = await connectDatabase();

    try {
      const query = `
        SELECT a.*, STRING_AGG(ar.comment, '\n') AS comment FROM articles a
        JOIN Article_Reviewers_Table ar ON a.article_id = ar.article_id
        WHERE a.author_id = $1 AND a.year = $2
        GROUP BY a.article_id, a.submission_date, a.author_id, a.year
        ORDER BY a.submission_date DESC;
      `;

      const values = [author_id, year];

      const result = await client.query(query, values);

      return result.rows;
    } catch (error) {
      throw new Error('Error fetching articles by year');
    } finally {
      client.release();
    }
  }
}

module.exports = { AuthorModel };
