const User = require("../../model/user.model");
const bcrypt = require("bcrypt");
// const httpStatus = require("http-status");
const { accessToken, refreshToken, checkPassword } = require("../../util/common");


const saveUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(404).json({
        message: "Already Exist",
      });
    }
    // const plainText = password.toString()
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
    const createUser = await User.create({
      name,
      email,
      password: hashpassword,
      role,
    });
    return res.status(200).json({
      message: "User Created",
      data: createUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  // check email
  if (!user) {
    return res.status(401).json({
      message: "User not exist",
    });
  }

  // check password
  if (!checkPassword(password, user.password)) {
    return res.status(401).json({
      message: "Password is incorrect.",
    });
  }

  // ACCESS TOKEN IS PERMANENT AND REFRESH TOKEN IS TEMP, CREATED USING THE ACCESS TOKEN
  const generateAccessToken = accessToken(user);
  const generateRefreshToken = refreshToken(user);

  if (!generateAccessToken || !generateRefreshToken) {
    return res.status(401).json({
      message: "Cannot generate token",
    });
  }

  const userResponse = {
    userId: user._id,
    email: user.email,
    role: user.role,
    accessToken: generateAccessToken,
    refreshToken: generateRefreshToken,
  };

  return res.status(201).json({
    message: "User fetch successfully",
    data: userResponse,
  });

  //if password if correct then, we will generate access and refresh token
  // generate--access and refresh token-- send
};

const getAllUsers = async (req, res) => {
  const users = await User.find();

  if (!users) {
    return res.status(200).json({
      message: "No Users present to fetch",
      data: [],
    });
  }
  return res.status(200).json({
    message: "Users fetched Successfully!",
    data: users,
  });
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    res.status(404).json({
      message: "User not found",
      data: {},
    });
  }

  return res.status(200).json({
    message: "User found Successfully.",
    data: user,
  });
};

const deleteUserById = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      message: "User Not Found",
    });
  }
  await User.deleteOne({ _id: id });
  return res.status(200).json({
    message: "User deleted Successfully!",
  });
};

const updateUserById = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // 1.filter-- if empty-- then update the first in the doc
  await User.updateOne({ _id: id }, { $set: data });
  return res.status(200).json({
    message: "User Updated Successfully!!",
    data: user,
  });
};

// aggregation pipleline-- function
// match-- show only the match
// project-- pass the fields-- in this we can include or execule the fields we want to pass to the next stage
// const userProjection = async ()=> {
//   const user = await User.aggregate([
//     {$project: {}}
//   ])

// }

module.exports = {
  saveUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  loginUser,
};
