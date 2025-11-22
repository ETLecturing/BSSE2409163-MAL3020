// This bypasses real JWT verification for tests
export const protect = (req, res, next) => {
  req.user = { _id: "mockUserId", username: "mockuser", name: "Mock User" };
  next();
};