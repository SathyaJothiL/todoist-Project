export const catchUnhandledUrl = (req, res, next) => {
  const error = new Error("Url doesn't exists");
  error.status = 404;
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  if (err.status) {
    console.log(err.message);
    res.status(err.status).json({ message: err.message || "Error" });
    return;
  }
  err.status = 500;
  res.status(err.status).json({ message: "Internal Server Error" });
  console.log(err.message);
  console.log("Error in Server");
};
