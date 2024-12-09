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

    static async showSubmissions() {
        const client = await connectDatabase();
    
        try {
            const result = await client.query('select * from submissionperiods ORDER BY start_date;');
            console.log('Fetched submissions:', result.rows); 
            return result.rows;
        } catch (error) {
            console.error('Error fetching submissions:', error); 
            throw error;
        } finally {
            client.release();
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

}

module.exports = { AdminModel };
