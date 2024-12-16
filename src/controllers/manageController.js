const { ManageModel } = require('../models/ManageModel.js');
const strings = require('../locales/strings.js');
const { query } = require('express');
const { AdminController } = require('./adminController.js');

class ManageController {
  static async register(req, res) {

    if (req.path === '/register') {

      try {
        let role = 'author';

        const { first_name, last_name, email, phone, affiliation,password } = req.body;

        if (!first_name || !last_name || !email || !phone || !affiliation || !password) {
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
    } else if (req.path === '/add-reviewer') {

      try {
        let role = 'reviewer';
        const { first_name, last_name, email, phone, affiliation, password } = req.body;

        if (!first_name || !last_name || !email || !phone || !affiliation || !password) {
          throw new Error('fieldsAreMandatory');
        }

        await ManageModel.register(first_name, last_name, email, phone, affiliation, role, password);

        res.render('addReviewer', { successMessage: 'User registered successfully!', errorMessage: null });
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

        res.render('addReviewer', { successMessage: null, errorMessage });
      }
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new Error('fieldsAreMandatory');
      }

      const user = await ManageModel.login(email);

      if (!user) {
        throw new Error('userNotFound');
      }

      if (user.password !== password) {
        throw new Error('invalidPassword');
      }

      req.session.user = user;

      switch (user.role) {
        case 'admin':
          return res.redirect('/admin/welcome-admin');
        case 'author':
          return res.redirect('/author/welcome-author');
        case 'reviewer':
          return res.redirect('/reviewer/welcome-reviewer');
        default:
          return res.status(403).send('Unauthorized role');
      }
    } catch (error) {
      let errorMessage;

      switch (error.message) {
        case 'fieldsAreMandatory':
          errorMessage = strings.errorMessages.fieldsAreMandatory;
          break;
        case 'userNotFound':
          errorMessage = strings.errorMessages.userNotFound;
          break;
        case 'invalidPassword':
          errorMessage = strings.errorMessages.invalidPassword;
          break;
        default:
          errorMessage = strings.errorMessages.databaseError;
          break;
      }

      res.render('login', { successMessage: null, errorMessage });
    }
  }
}

module.exports = { ManageController };
