const { ManageModel } = require('../models/ManageModel.js');
const strings = require('../locales/strings.js');

class ManageController {
  static async register(req, res) {
    try {
      const { first_name, last_name, email, phone, affiliation, role, password } = req.body;

      if (!first_name || !last_name || !email || !phone || !affiliation || !role || !password) {
        throw new Error('fieldsAreMandatory');
      }

      await ManageModel.register(first_name, last_name, email, phone, affiliation, role, password);

      res.render('index', { successMessage: 'User registered successfully!', errorMessage: null });
    } catch (error) {
      let errorMessage;

      switch (error.message) {
        case 'fieldsAreMandatory':
          errorMessage = strings.errorMessages.fieldsAreMandatory;
          break;
        case 'userExists':
          errorMessage = strings.errorMessages.userExists;
          break;
        case 'invalidPhone':
          errorMessage = strings.errorMessages.invalidPhone;
          break;
        default:
          errorMessage = strings.errorMessages.databaseError;
          break;
      }

      res.render('index', { successMessage: null, errorMessage });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).send(strings.errorMessages.fieldsAreMandatory);
      }

      const user = await ManageModel.login(email);

      if (!user) {
        return res.status(401).send("The user does not exist.");
      }

      if (user.password !== password) {
        return res.status(401).send("Invalid password.");
      }

      if (user.role == 'admin') {
        res.render('welcomeAdmin', { user });
      } else if (user.role == 'author') {
        res.render('welcomeAuthor', { user });
      } else if (user.role == 'reviewer') {
        res.render('welcomeReviewer', { user });
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = { ManageController };
