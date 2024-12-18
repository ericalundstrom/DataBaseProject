const strings = {
  errorMessages: {
    AssignTwoReviewers: "Must assign two reviewers to an article",
    databaseError: "There was an error with the database. Please try again later.",
    datesMustBeInSameYear: "Can't create a submission period with different years",
    fieldsAreMandatory: "All fields are mandatory.",
    invalidArticleType: "Invalid article type.",
    invalidArticleStatus: "Invalid article status.",
    invalidCredentials: "Invalid email or password.",
    invalidPassword: "Invalid password.",
    invalidPhone: "Phone number must consist of numbers only.",
    MaxTwoAssigned: "Author already has two articles assigned",
    moreThanFourKeywords: "You can only have up to 4 keywords.",
    noActiveSubmissionPeriod: "There is no active submission period.",
    noArticlesFound: "No articles found.",
    requestedResourceNotFound: "The requested resource was not found.",
    submissionExistsForYear: "Can't create two submission period for one year",
    submissionOutOfPeriod: "The submission period has ended or has not started yet. Please try in the next submission period.",
    userExists: "This email is already registered.",
    userNotFound: "User does not exist.",
    unauthorized: "Unauthorized access.",
  },
  successMessages: {
    articleSubmitted: "Article submitted successfully!",
    deletedReviewer: "Deleted reviewer successfully!",
    showingSubmissions: "Fetched submission successfully!",
    submissionCreated: "Submission time created successfully!",
    userRegistered: "User registered successfully!",
  },
};

module.exports = strings;
