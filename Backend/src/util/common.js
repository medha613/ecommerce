const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const httpStatus = require("http-status");

const checkPassword = (newPassword, oldPassword) => {
  return bcrypt.compare(newPassword, oldPassword);
};

const accessToken = (user) => {
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1hr",
    }
  );

  return token;
};

const refreshToken = (user) => {
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1hr",
    }
  );
  return token;
};

// middlewareee
const authJwt = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    const accesstoken = token.replace("Bearer ", "").trim();

    // verify jwt
    const userDetails = jwt.verify(accesstoken, process.env.JWT_SECRET_KEY);
    req.user = userDetails;

    next();
  } catch (e) {
    return res.status(400).json({
      message: "User Authorization failed",
      data: e,
    });
  }
};

const isAdmin = (req, res, next) => {
  const user = req.user;
  const role = user?.role;

  if (role == "Admin") {
    next();
  }
  return res.status(400).json({
    message: "you are not authorized to this route.",
  });
};

const isCustomer = (req, res, next) => {
  const user = req?.user;
  const role = user?.role;
  if (role == "Customer") next();

  return res.status(400).json({
    message: "you are not authorized to this route.",
  });
};

const isVendor = (req, res, next) => {
  const user = req?.user;
  const role = user?.role;

  if (role == "Vendor") next();

  return res.status(400).json({
    message: "you are not authorized to this route",
  });
};

module.exports = {
  checkPassword,
  accessToken,
  refreshToken,
  authJwt,
  isAdmin,
  isCustomer,
  isVendor,
};
