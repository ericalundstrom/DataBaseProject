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

  static async showSubmissions(req, res) {
    try {
        const submissions = await AdminModel.showSubmissions();

        console.log(submissions);

        res.render('editSubmission', { 
            submissions, // Skicka data under nyckeln "submissions"
            successMessage: null, 
            errorMessage: null 
        });
    } catch (error) {
        const errorMessage = strings.errorMessages.databaseError;
        console.log(submissions);
        res.render('editSubmission', { 
            submissions: [], // Skicka en tom lista om ett fel uppstår
            successMessage: null, 
            errorMessage 
        });
    }
  }




}

module.exports = { AdminController };
