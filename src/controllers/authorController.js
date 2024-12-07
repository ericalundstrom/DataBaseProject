const { AuthorModel } = require('../models/AuthorModel.js');
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
}

module.exports = { AuthorController };
