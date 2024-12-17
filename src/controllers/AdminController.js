const { AdminModel } = require('../models/AdminModel.js');
const strings = require('../locales/strings.js');

class AdminController {
  static async createSubmission(req, res) {
    try {

      const {start_date, end_date } = req.body;

      if (!start_date || !end_date) {
        throw new Error('fieldsAreMandatory');
      }

      const startYear = new Date(start_date).getFullYear();
      const endYear = new Date(end_date).getFullYear();

      if (startYear !== endYear) {
        throw new Error('datesMustBeInSameYear');
      }

      const year = startYear;

      await AdminModel.createSubmission(start_date, end_date, year);

      res.render('createSubmission', { successMessage: strings.successMessages.submissionCreated, errorMessage: null });
    } catch (error) {
      let errorMessage;

      switch (error.message) {
        case 'fieldsAreMandatory':
          errorMessage = strings.errorMessages.fieldsAreMandatory;
          break;
        case 'unauthorized':
          errorMessage = strings.errorMessages.unauthorized;
          break;
        case 'submissionExistsForYear':
          errorMessage = strings.errorMessages.submissionExistsForYear;
          break;
          case 'datesMustBeInSameYear':
            errorMessage = strings.errorMessages.datesMustBeInSameYear;
            break;
        default:
          errorMessage = strings.errorMessages.databaseError;
          break;
      }

      res.render('createSubmission', { successMessage: null, errorMessage });
    }
  }

  static async getAllArticles(req, res) {
    try {
        const user = req.session.user;

        if (!user || !user.user_id) {
            throw new Error('unauthorized');
        }

    const years = await AdminModel.getArticleYears();

    const year = req.query.year || null; 
    const query = req.query.query ? req.query.query.trim() : null;

    const isQueryEmpty = !query;
    const isYearNull = !year;

    let articles;
    if (isQueryEmpty && isYearNull) {
      articles = await AdminModel.getAllArticles();
    } else if (!isQueryEmpty && isYearNull) {
      articles = await AdminModel.searchArticles(query);
    } else if (isQueryEmpty && !isYearNull) {
      articles = await AdminModel.getAllArticles(year);
    } else {
      articles = await AdminModel.searchArticles(query, year);
    }

    return { articles, years, searchQuery: query || '', selectedYear: year || '' };

    } catch (error) {
      let errorMessage = strings.errorMessages.databaseError;
      res.render('allArticles', {
        articles: [],
        years: [],
        year,
        searchQuery: req.query.query || '',
        selectedYear: req.query.year || '',
        successMessage: null,
        errorMessage: strings.errorMessages.databaseError
      });
    }
  }

  static async getArticles (req,res){
    try{
      const user = req.session.user;

      if (!user || !user.user_id) {
        throw new Error('unauthorized');
      }

      const articles = await AdminModel.getArticles();

      return { articles };
    } catch (error) {
      let errorMessage = strings.errorMessages.databaseError;
      res.render('assignReviewer', {
        articles: [],
        successMessage: null,
        errorMessage
      });
    }
  }

  static async getReviewers (req,res){
    try{
      const user = req.session.user;

      if (!user || !user.user_id) {
        throw new Error('unauthorized');
      }

      const reviewers = await AdminModel.getReviewers();

      return {reviewers};
    }catch (error) {
      let errorMessage = strings.errorMessages.databaseError;
      res.render('assignReviewer', {
        reviewers: [],
        successMessage: null,
        errorMessage
      });
    }
  }

  static async getAllReviewers (req, res) {
    try{
      const user = req.session.user;

      if (!user || !user.user_id) {
        return res.redirect('/login');
      }

      const reviewers = await AdminModel.getAllReviewers();

      return {reviewers}
    }catch (error) {
      let errorMessage = strings.errorMessages.databaseError;
      res.render('removeReviewer', {
        reviewers: [],
        successMessage: null,
        errorMessage
      });
    }
  }

  static async assignReviewers(req, res) {
    const user = req.session.user;
  
    if (!user || !user.user_id) {
      return res.redirect('/login');
    }
  
    const reviewersData = req.body.reviewers; 
    const articlesData = req.body.articles; 
  
    try {
      for (const [index, reviewers] of reviewersData.entries()) {
        const article = articlesData[index];
  
        const reviewer1 = reviewers.reviewer1 || null;
        const reviewer2 = reviewers.reviewer2 || null;

        if (!reviewer1 && !reviewer2) {
          continue;
        }

        if (reviewer1 && reviewer2) {
          await AdminModel.assignReviewersToArticle(article.id, reviewer1, reviewer2);
        } else {
            throw new Error('fieldsAreMandatory'); 
        }
  
      }
  
      res.render('assignReviewer', {
        user,
        articles: await AdminModel.getArticles(),  
        reviewers: await AdminModel.getReviewers(), 
        successMessage: 'Reviewers assigned successfully.',
        errorMessage: null
      });
    } catch (error) {
      console.error(error);
      let errorMessage;
      switch (error.message) {
        case 'fieldsAreMandatory':
          errorMessage = strings.errorMessages.fieldsAreMandatory;
          break;
        case 'unauthorized':
          errorMessage = strings.errorMessages.unauthorized;
          break;
        case 'MaxTwoAssigned':
          errorMessage = strings.errorMessages.MaxTwoAssigned;
          break;
        default:
          errorMessage = strings.errorMessages.databaseError;
          break;
      };
      res.render('assignReviewer', {
        user,
        articles: await AdminModel.getArticles(),  
        reviewers: await AdminModel.getReviewers(),  
        successMessage: null,
        errorMessage
      });
    }
  }
 
  static async searchArticles(query, year) {

    const isQueryEmpty = !query || query.trim() === "";
    const isYearNull = year == null;
    const years = await AdminModel.getArticleYears();

    if (isQueryEmpty) {

        const articles = isYearNull 
            ? await AdminModel.getAllArticles() 
            : await AdminModel.getAllArticles(year);
        return { articles, years };
    } else {

        const articles = isYearNull 
            ? await AdminModel.searchArticles(query) 
            : await AdminModel.searchArticles(query, year); 
        return { articles, years };
    }
}

  static async removeReviewer (req, res){
    try {
      const user = req.session.user;
      
      if (!user || !user.user_id) {
        return res.redirect('/login');
      }
      const { reviewer_id } = req.body;
      await AdminModel.removeReviewer(reviewer_id); 
      const reviewers = await AdminModel.getAllReviewers();
      console.log(reviewers);

      res.render('removeReviewer', {
        successMessage: strings.successMessages.deletedReviewer,
        errorMessage: null,
        reviewers
      });
     
    } catch (error) {
      let errorMessage;

      switch (error.message) {
        case 'unauthorized':
          errorMessage = strings.errorMessages.unauthorized;
          break;
        default:
          errorMessage = strings.errorMessages.databaseError;
          break;
      }
      res.render('removeReviewer', { 
        successMessage: null, 
        errorMessage, 
        reviewers: []
      });
    }
  }
  
}

module.exports = { AdminController };
