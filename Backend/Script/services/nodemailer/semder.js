import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const EMAIL_USER = process.env.SMARTREPORT_EMAIL; 
const EMAIL_PASS = process.env.SMARTREPORT_EMAIL_PASSWORD; 


const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});


export const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"SmartReport" <${EMAIL_USER}>`,
      to,
      subject,
      html, 
    });

    console.log("Email sent: ", info.messageId);
    return info;
  } catch (err) {
    console.error("Error sending email: ", err);
    throw err;
  }
};
