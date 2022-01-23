const ErrorResponse = (status, msg, req,res) => {
  res.status(status).json({
    error: msg,
  });
};

module.exports = ErrorResponse;
