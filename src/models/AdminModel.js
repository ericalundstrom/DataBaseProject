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
          const query = 'SELECT article_id, title, article_type, keywords, article_status, submission_date, content FROM articles';
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
          const query = `SELECT user_id, CONCAT(first_name, ' ', last_name) AS name FROM users WHERE role = 'reviewer'`;
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

    // static async assignReviewersToArticle(articleId, reviewer1, reviewer2) {
    //     const client = await connectDatabase();
      
    //     try {

    //         const newReviewId = await this.generateArticleId(client);

    //         if (condition) {
                
    //         }

    //         const insertReviewerTable = `
    //             INSERT INTO Article_Reviewers_Table
    //             values($1, $2, $3, 'under review' ); 
    //         `;

    //         const ReviewerTableValues = [newReviewId, articleId, reviewer1];

    //         await client.query(insertReviewerTable, ReviewerTableValues);

    //         // Första query: Lägger till den första reviewern
    //         const insertReviewer1Query = `
    //             INSERT INTO Article_Reviewers_Table (article_id, reviewer_id, decision)
    //             VALUES ($1, $2, 'under review')
    //         `;
    //         const insertReviewer1Values = [articleId, reviewer1];
            
    //         // Kör query för den första reviewern
    //         await client.query(insertReviewer1Query, insertReviewer1Values);
            
    //         // Andra query: Lägger till den andra reviewern
    //         const insertReviewer2Query = `
    //             INSERT INTO Article_Reviewers_Table (article_id, reviewer_id, decision)
    //             VALUES ($1, $2, 'under review')
    //         `;
    //         const insertReviewer2Values = [articleId, reviewer2];
            
    //         // Kör query för den andra reviewern
    //         await client.query(insertReviewer2Query, insertReviewer2Values);
    
    //     } catch (error) {
    //         console.error('Error assigning reviewers:', error);
    //         throw new Error('Error assigning reviewers');
    //     } finally {
    //         client.end();
    //     }
    // }
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
            // Lägg till reviewer till Reviewers_Table
            const insertReviewerQuery = `
                INSERT INTO reviewers_Table (reviewer_id, research_area)
                VALUES ($1, 'Skola')
                ON CONFLICT (reviewer_id) DO NOTHING
            `;
            const reviewerValues = [reviewerId];
            await client.query(insertReviewerQuery, reviewerValues);
        } catch (error) {
            console.error('Error adding reviewer to Reviewers_Table:', error);
            throw new Error('Error adding reviewer');
        }
    }

    static async assignReviewersToArticle(articleId, reviewer1, reviewer2) {
        const client = await connectDatabase();
      
        try {
            // Först, uppdatera Reviewers_Table för varje reviewer
            await this.addReviewerToTable(client, reviewer1); // Lägg till första reviewern
            await this.addReviewerToTable(client, reviewer2); // Lägg till andra reviewern
    
            // Sedan, uppdatera Article_Reviewers_Table för varje reviewer

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
            throw new Error('Error assigning reviewers');
        } finally {
            client.end();
        }
    }

}

module.exports = { AdminModel };
