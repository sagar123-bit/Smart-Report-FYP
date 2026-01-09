import { sendEmail } from "./semder.js";

export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    await sendEmail({
      to: email,
      subject: "Verify Your SmartReport Account",
      html: `
        <h2>SmartReport Verification</h2>
        <p>Hi! Please use the following code to verify your account:</p>
        <h3>${verificationCode}</h3>
        <p>This code will expire in 10 minutes.</p>
      `,
    });
  } catch (err) {
    console.error("Error sending verification email:", err);
    throw err;
  }
};
