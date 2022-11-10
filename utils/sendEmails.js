const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

module.exports.sendVerifyEmail = (authVerifytoken, email, id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: "patilajit020@gmail.com",
      to: email,
      subject: "For Verification mail",
      html: `<h3>Hello ${email} </h3>
            <br/>
            <h3>Thank you for Registration Click Below Button to Verify your Account
            </h3>
            <a href="${process.env.BASE_URL}/auth/verifyAccount/${authVerifytoken}/${id} " style="background: #000; padding: 4px; color: #fff;">Verify Account</a>
            `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        // return "Check your email to verify ";
        console.log("Email has been sent :-", info.response);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.sendRestPasswordMail = (authVerifytoken, email, id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: "patilajit020@gmail.com",
      to: email,
      subject: "ResetPassword",
      html: `<h3>Hello ${email} </h3>
            <br/>
            <h3>Have you forgotten password , Don't worry reset your password by Click Below
            </h3>
            <a href="${process.env.BASE_URL}/auth/resetPassword/${authVerifytoken}/${id}" style="margin: 4px;background-color: black; color: #fff;padding:5px;">ResetPassword</a>
            `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        // return "Check your email to verify ";
        // console.log("Email has been sent :-", info.response);
      }
    });
  } catch (err) {
    console.log(err);
  }
};
