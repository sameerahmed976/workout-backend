import asyncHandler from "express-async-handler";
import Joi from "joi";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/usersModel";
import mongoose from "mongoose";
import sendEmail from "../db/email.Config";

const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const { error } = validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error);
  }

  //duplicate user
  const userExist = await User.findOne({
    email,
  });

  if (userExist) {
    res.status(400);
    throw new Error("user already exists");
  }
  // hash password

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  // create user

  const user = await User.create({
    email,
    username,
    password: hashPassword,
  });

  res.status(201).json({
    id: user._id,
    email: user.email,
    username: user.username,
    token: generateToken(user._id),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      id: user._id,
      email: user.email,
      username: user.username,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("invalid credentials");
  }
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

const validate = (user) => {
  const userSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[A-Za-z0-9]{3,30}$"))
      .required(),
  });

  return userSchema.validate(user);
};

const generateToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

// // @desc user password change
// // @route api/v1/users/changePassword
// // @access private

// const changePassword = asyncHandler(async (req, res) => {
//   const { password, confirmPassword } = req.body;

//   const { _id } = req.user;

//   // both fields required

//   if (!password || !confirmPassword) {
//     res.status(400);
//     throw new Error("All fields required");
//   }

//   // password not matching

//   if (password !== confirmPassword) {
//     res.status(400);
//     throw new Error("password does not match");
//   }

//   // password match and generate new password

//   const hashedPassword = await generateAndMatchPassword(password);
//   // console.log(
//   //   `* ~ file: userController.js:117 ~ changePassword ~ hashedPassword`,
//   //   hashedPassword
//   // );
//   const hashedConfirmPassword = await generateAndMatchPassword(confirmPassword);
//   // console.log(
//   //   `* ~ file: userController.js:119 ~ changePassword ~ hashedConfirmPassword`,
//   //   hashedConfirmPassword
//   // );

//   // console.log(req.user);
//   // update user
//   const user = await User.findByIdAndUpdate(
//     _id,
//     {
//       password: hashedPassword,
//       confirmPassword: hashedConfirmPassword,
//     },
//     {
//       new: true,
//     }
//   );

//   // user is not valid

//   if (!user) {
//     res.status(401);
//     throw new Error(`unauthorized user `);
//   }

//   // user is valid
//   res.status(200).json({
//     success: true,
//     data: {
//       name: user.name,
//       email: user.email,
//       message: "Password change successfully",
//     },
//   });
// });

// reset / forget password
// public route
const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error("email is required");
  }

  const user = await User.findOne({
    email,
  });

  // console.log(`* ~ file: userController.js:16 ~ userRegister ~ user`, user);

  if (!user) {
    res.status(400);
    throw new Error("Email  does not exists");
  }

  const token = generateAccessToken(user._id, "10m");
  const link = `http://localhost:5173/reset/${token}/${user._id}`;
  // const link = `http://localhost:5173/reset/${user._id}`;

  // http://localhost:5173/reset/asadas/asdasdasdasd

  // console.log(`* ~ file: userController.js:186 ~ resetPassword ~ link`, link);
  const html = ` <a href=${link} target="_blank"  >click here</a>  to reset your password , ${link}`;
  // send mail and reset link is set

  const info = sendEmail(user.email, html);

  res.status(200).json({
    success: true,
    data: {
      name: user.name,
      email: user.email,
      message: "Password reset change successfully,Please check your email",
      info: info,
    },
  });
});

// password change url /:id/:token
// password match and generate new password public route

const resetPassword = asyncHandler(async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { id, token } = req.params;
  // both fields required

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("user not authorize ");
  }

  if (!password || !confirmPassword) {
    res.status(400);
    throw new Error("All fields required");
  }

  // password not matching

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error("password does not match");
  }

  // verify jwt

  const decoded = verifyJWT(token);

  // password match and generate new password public route

  const hashedPassword = await generateAndMatchPassword(password);
  // console.log(
  //   `* ~ file: userController.js:117 ~ changePassword ~ hashedPassword`,
  //   hashedPassword
  // );
  const hashedConfirmPassword = await generateAndMatchPassword(confirmPassword);
  // console.log(
  //   `* ~ file: userController.js:119 ~ changePassword ~ hashedConfirmPassword`,
  //   hashedConfirmPassword
  // );

  // console.log(req.user);
  // update user
  const user = await User.findByIdAndUpdate(
    id,
    {
      password: hashedPassword,
      confirmPassword: hashedConfirmPassword,
    },
    {
      new: true,
    }
  );

  // user is not valid

  if (!user) {
    res.status(401);
    throw new Error(`unauthorized user `);
  }
  if (user._id.toString() !== decoded.id) {
    res.status(400);
    throw new Error("inValid user  id or token");
  }
  // user is valid
  res.status(200).json({
    success: true,
    data: {
      name: user.name,
      email: user.email,
      message: "Password reset successfully",
    },
  });
});

export const usersController = {
  signup,
  login,
  getMe,

  resetPassword,
  forgetPassword,
};

const verifyJWT = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const generateAndMatchPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const generateAccessToken = (id, expires = "1d") => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expires,
  });
};
