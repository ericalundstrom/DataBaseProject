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

      res.render('index', { successMessage: 'User registered successfully!' });
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

      res.render('index', { errorMessage });
    }
  }
}

module.exports = { ManageController };
