import { sendEmail } from "./semder.js";

export const sendPoliceVerificationEmail = async (email, status) => {
  try {
    const isVerified = status === "verified";

    await sendEmail({
      to: email,
      subject: `SmartReport Police Account ${isVerified ? "Verified" : "Rejected"}`,
      html: `
        <h2>SmartReport Police Account ${isVerified ? "Verification Successful" : "Verification Rejected"}</h2>
        <p>Hello,</p>
        <p>
          Your request to register as a police officer on <strong>SmartReport</strong> has been 
          <strong>${isVerified ? "approved" : "rejected"}</strong>.
        </p>
        ${
          isVerified
            ? `<p>You can now log in and start using your police dashboard.</p>`
            : `<p>If you believe this was a mistake, please contact the system administrator.</p>`
        }
        <p>Thank you for your patience.</p>
      `,
    });
  } catch (err) {
    console.error("Error sending police verification email:", err);
    throw err;
  }
};
