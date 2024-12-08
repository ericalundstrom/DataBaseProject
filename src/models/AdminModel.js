const { connectDatabase } = require('../utils/database.js');
const strings = require('../locales/strings.js');

class AdminModel {

    static async createSubmission(start_date, end_date, year){
        const client = await connectDatabase();

        try{

            const existingSubmission = await this.checkSubmissionExistsForYear(client, year);
            if (existingSubmission) {
                throw new Error('submissionExistsForYear');
            }

            const newSubmissionId = await this.generateArticleId(client);
            const query = 'INSERT INTO submissionperiods (period_id, start_date, end_date, year) VALUES ($1, $2, $3, $4)';
            const values = [newSubmissionId, start_date, end_date, year];

            await client.query(query, values);

            return {start_date, end_date, year};

        }catch (error) {
            throw error;
        } finally {
            client.end();
        }
    }

    static async generateArticleId(client) {
        try {
          const result = await client.query('SELECT MAX(period_id) AS max_id FROM submissionperiods');
          const maxId = result.rows[0].max_id || 0;
          return maxId + 1;
        } catch (error) {
          console.error('Error at generating ID:', error);
          throw new Error('Could not generate a unique article ID');
        }
      }

      static async checkSubmissionExistsForYear(client, year) {
        try {
            const query = 'SELECT * FROM submissionperiods WHERE year = $1';
            const values = [year];
            const result = await client.query(query, values);
            return result.rows.length > 0; // Returnerar true om det finns en period för året
        } catch (error) {
            console.error('Error checking for existing submission period:', error);
            throw new Error('Could not verify existing submission period');
        }
    }

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
            client.end();
        }
    }
}

module.exports = { AdminModel };
