import { sendEmail } from "./semder.js";
export const sendForgetPassEmail = async (email, resetLink) => {
  try {
    await sendEmail({
      to: email,
      subject: "Reset Your SmartReport Password",
      html: `
        <h2>SmartReport Password Reset</h2>
        <p>Hello! You requested to reset your password. Click the link below to set a new password:</p>
        <p><a href="${resetLink}" target="_blank" style="color: #1D4ED8;">Reset Password</a></p>
        <p>This link will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
      `,
    });
  } catch (err) {
    console.error("Error sending password reset email:", err);
    throw err; 
  }
};