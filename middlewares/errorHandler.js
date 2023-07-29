const errorHandler = (err, req, res, next) => {
  // console.log(`* ~ file: errorHandler.js:2 ~ errorHandler ~ err`, err);
  // console.log(err.statusCode);
  const statusCode = err.statusCode ? err.statusCode : 500;

  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
