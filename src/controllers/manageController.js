const { ManageModel } = require('../models/ManageModel.js');
const strings = require('../locales/strings.js');

class ManageController {
  static async register(req, res) {
    try {
      const { first_name, last_name, email, phone, affiliation, role, password } = req.body;

      if (!first_name || !last_name || !email || !phone || !affiliation || !role || !password) {
        return res.status(400).send(strings.errorMessages.fieldsAreMandatory);
      }

      const data = await ManageModel.register(first_name, last_name, email, phone, affiliation, role, password);

      res.render('welcome', { data });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = { ManageController };
