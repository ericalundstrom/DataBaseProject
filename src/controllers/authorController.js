const { AuthorModel } = require('../models/AuthorModel.js');
const strings = require('../locales/strings.js');

class AuthorController {
  static async createArticle(req, res) {
      req.session.user = user;
  }
}

module.exports = { AuthorController };
