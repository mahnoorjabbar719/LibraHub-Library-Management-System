import "dotenv/config";
import nodemailer from "nodemailer";

const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPassword = process.env.EMAIL_APP_PASSWORD
    ?.replace(/\s+/g, "")
    .trim();

  if (!emailUser || !emailPassword) {
    throw new Error(
      "EMAIL_USER or EMAIL_APP_PASSWORD is missing from server/.env"
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  if (!to) {
    throw new Error("Recipient email is required");
  }

  const transporter = createTransporter();

  const info = await transporter.sendMail({
    from: `"LibraHub" <${process.env.EMAIL_USER.trim()}>`,
    to,
    subject,
    text,
    html,
  });

  return info;
};

export const verifyEmailConnection = async () => {
  const transporter = createTransporter();
  await transporter.verify();
  console.log("✅ Gmail server is ready to send emails");
};

export default sendEmail;