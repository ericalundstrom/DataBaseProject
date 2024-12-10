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

    static async getArticles() {
        const client = await connectDatabase();
        try {
          const query = `SELECT 
            articles.article_id, articles.title, articles.content, articles.article_type, articles.keywords, articles.article_status, articles.submission_date
            FROM 
            articles 
            LEFT JOIN 
            article_reviewers_table 
            ON 
            articles.article_id = article_reviewers_table.article_id
            WHERE 
            article_reviewers_table.article_id IS NULL`;
          const result = await client.query(query);
          return result.rows;
        } catch (error) {
            throw new Error('Error fetching articles');
        } finally {
            client.end();
        }
    }

    static async getReviewers() {
        const client = await connectDatabase();
        try {
          const query = `SELECT u.user_id, CONCAT(u.first_name, ' ', u.last_name) AS name, COUNT(ar.article_id) AS article_count
            FROM Users u
            LEFT JOIN article_reviewers_table ar ON u.user_id = ar.reviewer_id
            WHERE u.role = 'reviewer'
            GROUP BY u.user_id, u.first_name, u.last_name
            HAVING COUNT(ar.article_id) < 2;
            `;
          const result = await client.query(query);
          return result.rows;
        } catch (error) {
          console.error('Error fetching reviewers:', error);
          throw new Error('Could not fetch reviewers');
        } finally {
          client.end();
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

    static async generateReviewId(client) {
        try {
          const result = await client.query('SELECT MAX(review_id) AS max_id FROM article_reviewers_table');
          const maxId = result.rows[0].max_id || 0;
          return maxId + 1;
        } catch (error) {
          console.error('Error at generating ID:', error);
          throw new Error('Could not generate a unique article ID');
        }

    }
      

    static async addReviewerToTable(client, reviewerId) {
        try {
            
            const existingTwoReviews = 'SELECT * FROM article_reviewers_table WHERE reviewer_id = $1';
            const existingUser = await client.query(existingTwoReviews, [reviewerId]);
      
            if (existingUser.rows.length > 1) {
              throw new Error('MaxTwoAssigned');
            }
            
            const insertReviewerQuery = `
                INSERT INTO reviewers_Table (reviewer_id, research_area)
                VALUES ($1, 'Skola')
                ON CONFLICT (reviewer_id) DO NOTHING
            `;
            const reviewerValues = [reviewerId];
            await client.query(insertReviewerQuery, reviewerValues);
        } catch (error) {
            console.error('Error adding reviewer to Reviewers_Table:', error);
            throw error; 
        }
    }

    static async assignReviewersToArticle(articleId, reviewer1, reviewer2) {
        const client = await connectDatabase();
      
        try {
            
            if (!reviewer1 || !reviewer2) {
                throw new Error('AssignTwoReviewers');
            }
           
            await this.addReviewerToTable(client, reviewer1); // Lägg till första reviewern
            await this.addReviewerToTable(client, reviewer2); // Lägg till andra reviewern
    

            const newReviewId = await this.generateReviewId(client);
            const insertReviewer1Query = `
                INSERT INTO Article_Reviewers_Table (review_id, article_id, reviewer_id, decision)
                VALUES ($1, $2, $3, 'under review')
            `;
            const insertReviewer1Values = [newReviewId, articleId, reviewer1];
            await client.query(insertReviewer1Query, insertReviewer1Values);

            const secondReviewId = newReviewId + 1;
    
            const insertReviewer2Query = `
                INSERT INTO Article_Reviewers_Table (review_id, article_id, reviewer_id, decision)
                VALUES ($1, $2, $3,'under review')
            `;
            const insertReviewer2Values = [secondReviewId, articleId, reviewer2];
            await client.query(insertReviewer2Query, insertReviewer2Values);
    
        } catch (error) {
            console.error('Error assigning reviewers:', error);
            throw new Error(error.message); 
        } finally {
            client.end();
        }
    }

}

module.exports = { AdminModel };
