const strings = require('../locales/strings.js');

class ErrorController {
  static get404(req, res) {
    res
      .status(404)
      .json(strings.errorMessages.requestedResourceNotFound);
  }
}

module.exports = { ErrorController };
