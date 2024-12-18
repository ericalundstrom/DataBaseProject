const { connectDatabase } = require('../utils/database.js');

async function createRemoveReviewerFunctionAndTrigger() {
  const client = await connectDatabase();

  try {
    await client.query('BEGIN');

    const createFunctionQuery = `
      CREATE OR REPLACE FUNCTION remove_reviewer_trigger()
      RETURNS TRIGGER AS $$
      BEGIN

        DELETE FROM article_reviewers_table WHERE reviewer_id = OLD.user_id;

        DELETE FROM reviewers_table WHERE reviewer_id = OLD.user_id;

        RETURN OLD;
      END;
      $$ LANGUAGE plpgsql
    `;
    await client.query(createFunctionQuery);

    const checkTriggerQuery = `
      SELECT tgname
      FROM pg_trigger
      WHERE tgname = 'trigger_remove_reviewer'
    `;
    const triggerResult = await client.query(checkTriggerQuery);

    if (triggerResult.rows.length > 0) {
      const dropTriggerQuery = `
        DROP TRIGGER trigger_remove_reviewer ON users
      `;
      await client.query(dropTriggerQuery);
    }

    const createTriggerQuery = `
      CREATE TRIGGER trigger_remove_reviewer
      AFTER DELETE ON users
      FOR EACH ROW
      EXECUTE FUNCTION remove_reviewer_trigger()
    `;
    await client.query(createTriggerQuery);

    await client.query('COMMIT');
  } catch (error) {
    console.error('Error creating function and trigger:', error);
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.end();
  }
}

async function getArticlesFunctionAndTrigger() {
    const client = await connectDatabase();
    try {
        const checkViewQuery = `
            SELECT * 
            FROM information_schema.views 
            WHERE table_name = 'available_articles_for_review'
        `;
        const viewResult = await client.query(checkViewQuery);

        if (viewResult.rows.length === 0) {
            const createViewQuery = `
                CREATE VIEW available_articles_for_review AS
                SELECT 
                    articles.article_id, 
                    articles.title, 
                    articles.content, 
                    articles.article_type, 
                    articles.keywords, 
                    articles.article_status, 
                    articles.submission_date, 
                    submissionperiods.end_date,
                    article_reviewers_table.article_id AS reviewer_assigned
                FROM 
                    articles
                JOIN 
                    submissionperiods ON articles.year = submissionperiods.year
                LEFT JOIN 
                    article_reviewers_table ON articles.article_id = article_reviewers_table.article_id
                WHERE 
                    submissionperiods.end_date < CURRENT_DATE
                    AND article_reviewers_table.article_id IS NULL;
            `;
            await client.query(createViewQuery);
        }

        const query = 'SELECT * FROM available_articles_for_review';
        const result = await client.query(query);
        return result.rows;
    } catch (error) {
        throw new Error(`Error fetching articles: ${error.message}`);
    } finally {
        client.end();
    }
}


module.exports = {
  createRemoveReviewerFunctionAndTrigger, getArticlesFunctionAndTrigger
};
