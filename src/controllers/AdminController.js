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

  static async getAllArticles (req, res){
    try{
    const user = req.session.user;

      if (!user || !user.user_id) {
        throw new Error('unauthorized');
      }
      const articles = await AdminModel.getAllArticles();
      return { articles };
    }catch(error) {
      let errorMessage = strings.errorMessages.databaseError;
      res.render('allArticles', {
        articles: [],
        successMessage: null,
        errorMessage
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
  
        const reviewer1 = reviewers.reviewer1;
        const reviewer2 = reviewers.reviewer2;
  
        await AdminModel.assignReviewersToArticle(article.id, reviewer1, reviewer2);
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
          case 'datesMustBeInSameYear':
            errorMessage = strings.errorMessages.datesMustBeInSameYear;
            break;
        default:
          errorMessage = strings.errorMessages.databaseError;
          break;
      };
      res.render('assignReviewer', {
        user,
        articles: [],  
        reviewers: [], 
        successMessage: null,
        errorMessage
      });
    }
  }

  static async searchArticles(query) {
    if (!query || query.trim() === "") {
      const articles = await AdminModel.getAllArticles();
      return { articles };
    }
    const articles = await AdminModel.searchArticles(query);
    return { articles };
  }

}

module.exports = { AdminController };
