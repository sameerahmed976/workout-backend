import nodemailer from "nodemailer";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
dotenv.config();

const sendEmail = asyncHandler(async (to, html) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, //admin user email id
      pass: process.env.EMAIL_PASS, //admin user email password
    },
  });

  const info = transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: to,
    subject: "Reset password link",
    html: html,
  });

  return info;
});

export default sendEmail;
