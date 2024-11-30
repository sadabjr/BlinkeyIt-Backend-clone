import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

// Check if the RESEND_API key is provided
if (!process.env.RESEND_API) {
  console.error("Provide resend API key in .env file");
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "BlinkeyIt <onboarding@resend.dev>",
      to: sendTo,
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("Email sending error:", error);
      return null; // Return null to gracefully handle errors
    }

    console.log("Email sent successfully:", data);
    return data;
  } catch (e) {
    console.error("Error in sendEmail:", e.message || e);
    return null;
  }
};

export default sendEmail;
