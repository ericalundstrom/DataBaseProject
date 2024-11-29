const { connectDatabase } = require('../utils/database.js');

class ManageModel {
  static async register(first_name, last_name, email, phone, affiliation, role, password) {
    const client = await connectDatabase();

    try {
      const newId = await this.generateUniqueId(client);

      const query = 'INSERT INTO users (user_id, first_name, last_name, email, phone, affiliation, role, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
      const values = [newId, first_name, last_name, email, phone, affiliation, role, password];

      await client.query(query, values);

      return { first_name, last_name, email, phone, affiliation, role };
    } catch (error) {
      throw new Error(error.message);
    } finally {
      client.end();
    }
  }

  static async generateUniqueId(client) {
    try {
      const result = await client.query('SELECT MAX(user_id) AS max_id FROM users');
      const maxId = result.rows[0].max_id || 0;
      return maxId + 1;
    } catch (error) {
      console.error('Error at generating ID:', error);
      throw new Error('Could not generate a unique ID');
    }
  }
}

module.exports = { ManageModel };
