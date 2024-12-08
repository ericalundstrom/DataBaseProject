const { AuthorModel } = require('../models/AuthorModel.js');
const { AdminModel } = require('../models/AdminModel.js');
const strings = require('../locales/strings.js');

class AuthorController {
  static async createArticle(req, res) {
    try {
      const user = req.session.user;

      if (!user || !user.user_id) {
        throw new Error('unauthorized');
      }

      const { title, article_type, keywords, content } = req.body;

      if (!title || !article_type || !keywords || !content) {
        throw new Error('fieldsAreMandatory');
      }

      const validArticleTypes = ['short article', 'full article', 'poster'];
      const validArticleStatuses = ['submitted', 'under review', 'accepted', 'rejected'];
      const article_status = 'submitted';

      if (!validArticleTypes.includes(article_type)) {
        throw new Error('invalidArticleType');
      }

      if (!validArticleStatuses.includes(article_status)) {
        throw new Error('invalidArticleStatus');
      }

      const keywordArray = keywords.split(',').map((kw) => kw.trim()).filter(Boolean);

      if (keywordArray.length > 4) {
      throw new Error('moreThanFourKeywords');
      }

      const sanitizedKeywords = keywordArray.join(',');
      const author_id = user.user_id;
      const submission_date = new Date().toISOString().split('T')[0];

      await AuthorModel.createArticle(author_id, title, article_type, sanitizedKeywords, article_status, content, submission_date);

      res.render('createArticle', { successMessage: strings.successMessages.articleSubmitted, errorMessage: null });
    } catch (error) {
      let errorMessage;

      switch (error.message) {
        case 'fieldsAreMandatory':
          errorMessage = strings.errorMessages.fieldsAreMandatory;
          break;
        case 'unauthorized':
          errorMessage = strings.errorMessages.unauthorized;
          break;
        case 'invalidArticleType':
          errorMessage = strings.errorMessages.invalidArticleType;
          break;
        case 'invalidArticleStatus':
          errorMessage = strings.errorMessages.invalidArticleStatus;
          break;
        case 'moreThanFourKeywords':
          errorMessage = strings.errorMessages.moreThanFourKeywords;
          break;
        default:
          errorMessage = strings.errorMessages.databaseError;
          break;
      }

      res.render('createArticle', { successMessage: null, errorMessage });
    }
  }

  static async submittedArticle(req, res) {
    try {
      const user = req.session.user;

      if (!user || !user.user_id) {
        throw new Error('unauthorized');
      }

      const author_id = user.user_id;
      const { year } = req.body;
      const currentYear = new Date().getFullYear();
      const selectedYear = year || currentYear;

      const articles = await AuthorModel.getArticlesByAuthorAndYear(author_id, selectedYear);

      const yearsToDisplay = [];
      for (let year = 2022; year <= currentYear; year++) {
        yearsToDisplay.push(year);
      }

      res.render('submittedArticle', {
        articles,
        availableYears: yearsToDisplay,
        selectedYear,
        successMessage: null,
        errorMessage: null,
      });
    } catch (error) {
      let errorMessage = strings.errorMessages.databaseError;
      res.render('submittedArticle', {
        articles: [],
        availableYears: [],
        selectedYear: null,
        successMessage: null,
        errorMessage
      });
    }
  }

  static async getSubmissionPeriod(req, res) {
    try {
      const user = req.session.user;

      if (!user || !user.user_id) {
        throw new Error('unauthorized');
      }

      const submissionPeriod = await AdminModel.getActiveSubmissionPeriod();

      function formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }

      const submissionStartDate = submissionPeriod?.start_date ? formatDate(submissionPeriod.start_date) : null;
      const submissionEndDate = submissionPeriod?.end_date ? formatDate(submissionPeriod.end_date) : null;

      return { submissionStartDate, submissionEndDate };
    } catch (error) {
      let errorMessage;

      switch (error.message) {
        case 'noActiveSubmissionPeriod':
          errorMessage = strings.errorMessages.noActiveSubmissionPeriod;
          break;
        default:
          errorMessage = strings.errorMessages.databaseError;
          break;
      }
      return { submissionStartDate: null, submissionEndDate: null };
    }
  }
}

module.exports = { AuthorController };
