const strings = {
  errorMessages: {
    databaseError: "There was an error with the database. Please try again later.",
    fieldsAreMandatory: "All fields are mandatory.",
    invalidArticleType: "Invalid article type.",
    invalidArticleStatus: "Invalid article status.",
    invalidCredentials: "Invalid email or password.",
    invalidPassword: "Invalid password.",
    invalidPhone: "Phone number must consist of numbers only.",
    moreThanFourKeywords: "You can only have up to 4 keywords.",
    noActiveSubmissionPeriod: "There is no active submission period.",
    requestedResourceNotFound: "The requested resource was not found.",
    userExists: "This email is already registered.",
    userNotFound: "User does not exist.",
    unauthorized: "Unauthorized access.",
    submissionExistsForYear: "Can't create two submission period for one year",
    submissionOutOfPeriod: "The submission period has ended or has not started yet. Please try in the next submission period.",
    datesMustBeInSameYear: "Can't create a submission period with different years"
  },
  successMessages: {
    userRegistered: "User registered successfully!",
    articleSubmitted: "Article submitted successfully!",
    submissionCreated: "Submission time created successfully!",
    showingSubmissions: "Fetched submission successfully!"
  },
};

module.exports = strings;
