const { connectDatabase } = require('../utils/database.js');
const strings = require('../locales/strings.js');

class AuthorModel {
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
      client.end();
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
        SELECT *
        FROM articles
        WHERE author_id = $1 AND year = $2
        ORDER BY submission_date DESC;
      `;

      const values = [author_id, year];

      const result = await client.query(query, values);

      return result.rows;
    } catch (error) {
      throw new Error('Error fetching articles by year');
    } finally {
      client.end();
    }
  }
}

module.exports = { AuthorModel };
