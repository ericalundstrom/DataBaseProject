const { connectDatabase } = require('../utils/database.js');
const strings = require('../locales/strings.js');
const { createRemoveReviewerFunctionAndTrigger, getArticlesFunctionAndTrigger } = require('../public/functions.js');

class AdminModel {

    static async createSubmission(start_date, end_date, year){
        const client = await connectDatabase();

        try{

            const existingSubmission = await this.checkSubmissionExistsForYear(client, year);
            console.log(existingSubmission);
            if (existingSubmission) {
                throw new Error('submissionExistsForYear');
            }

            const newSubmissionId = await this.generateArticleId(client);
            console.log(newSubmissionId);
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
    static async getAllArticles (year){
        const client = await connectDatabase();

        if (!year) {
            try{
                const query = `
                    SELECT 
                        articles.*, 
                        concat(users.first_name, ' ', users.last_name) AS full_name
                    FROM 
                        articles
                    LEFT JOIN 
                        users ON articles.author_id = users.user_id
                    ORDER BY submission_date DESC
                    `;
    
                const result = await client.query(query);
                return result.rows;
              } catch (error) {
                  throw new Error('Error fetching articles');
              } finally {
                  client.end();
              }
        }
        try{
            const query = `
                SELECT 
                    articles.*, 
                    concat(users.first_name, ' ', users.last_name) AS full_name
                FROM 
                    articles
                LEFT JOIN 
                    users ON articles.author_id = users.user_id
                WHERE EXTRACT(YEAR FROM articles.submission_date) = $1
                ORDER BY submission_date DESC
                `;

            const value = [year]
            const result = await client.query(query, value);

            return result.rows;
          } catch (error) {
              throw new Error('Error fetching articles');
          } finally {
              client.end();
          }
    }

    static async getArticleYears() {
        const client = await connectDatabase();
        try {
            const query = `
                SELECT DISTINCT EXTRACT(YEAR FROM submission_date) AS year
                FROM articles
                ORDER BY year DESC;
            `;
            const result = await client.query(query);
            // console.log("år" + result.rows);
            return result.rows; // Returnera en lista med år
        } catch (error) {
            console.error('Error fetching article years:', error);
            throw new Error('Error fetching years');
        } finally {
            client.end();
        }
    }
  
    static async getArticles() {
        const client = await connectDatabase();
        try {

            const articles = await getArticlesFunctionAndTrigger();
            return articles;
        } catch (error) {
            throw new Error(`Error fetching articles: ${error.message}`);
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
      
    static async getAllReviewers (){
        const client = await connectDatabase();
        try{
            const query = `select * from users where role = 'reviewer' order by first_name`;
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

    static async assignReviewersToArticle(articleId, reviewer1, reviewer2) {
        const client = await connectDatabase();
      
        try {
            await client.query('BEGIN');
            
            if (!reviewer1 || !reviewer2) {
                throw new Error('AssignTwoReviewers');
            }
           
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

            const updateArticleStatusQuery = `
                UPDATE Articles
                SET article_status = 'under review'
                WHERE article_id = $1
            `;

            await client.query(updateArticleStatusQuery, [articleId]);
            await client.query('COMMIT');

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error assigning reviewers:', error);
            throw new Error(error.message); 
        } finally {
            client.end();
        }
    }
  
    static async searchArticles(searchQuery, year) {

        const client = await connectDatabase();
    
        try {
            const likeQuery = `%${searchQuery}%`;
            let query; 
            const params = [likeQuery];
    
            if (!year) {
                query = `
                    SELECT articles.*, concat(users.first_name, ' ', users.last_name) AS full_name FROM articles
                    LEFT JOIN users ON articles.author_id = users.user_id
                    WHERE 
                    (users.role = 'author') AND (
                        title ILIKE $1 OR 
                        year::text ILIKE $1 OR 
                        article_type::text ILIKE $1 OR 
                        article_status::text ILIKE $1 OR
                        users.first_name ILIKE $1 OR
                        users.last_name ILIKE $1     
                    )
                    ORDER BY 
                    submission_date DESC;
                `;
            } else {
                query = ` 
                    SELECT articles.*, concat(users.first_name, ' ', users.last_name) AS full_name FROM articles
                    LEFT JOIN users ON articles.author_id = users.user_id 
                    WHERE 
                    (users.role = 'author') AND articles.year = $2 AND (
                        title ILIKE $1 OR 
                        year::text ILIKE $1 OR 
                        article_type::text ILIKE $1 OR 
                        article_status::text ILIKE $1 OR
                        users.first_name ILIKE $1 OR
                        users.last_name ILIKE $1     
                    )
                    ORDER BY 
                    submission_date DESC;
               ` ;
                params.push(year); 
            }
    
            const result = await client.query(query, params);
            return result.rows; 
    
        } catch (error) {
            console.error('Error assigning reviewers:', error);
            throw new Error(error.message); 
        } finally {
            client.end();
        }
    }

    static async removeReviewer(reviewer_id) {
        const client = await connectDatabase();
    
        try {
            await client.query('BEGIN');
            await createRemoveReviewerFunctionAndTrigger();
    
            const deleteArticleReviewerQuery = `DELETE FROM article_reviewers_table WHERE reviewer_id = $1;`;
            const deleteArticleReviewerValues = [reviewer_id];
            await client.query(deleteArticleReviewerQuery, deleteArticleReviewerValues);
    
            const deleteReviewerQuery = `DELETE FROM reviewers_table WHERE reviewer_id = $1;`;
            const deleteReviewerValues = [reviewer_id];
            await client.query(deleteReviewerQuery, deleteReviewerValues);
    
            const deleteUserQuery = `DELETE FROM users WHERE user_id = $1;`;
            const deleteUserValues = [reviewer_id];
            await client.query(deleteUserQuery, deleteUserValues);
    
            await client.query('COMMIT');
        } catch (error) {
            console.error('Error removing reviewer:', error);
    
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.end();
        }
    }
    
}

module.exports = { AdminModel };
