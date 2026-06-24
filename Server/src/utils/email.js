import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import logger from './logger.js';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER?.replace(/"/g, '').trim(),
    pass: process.env.SMTP_PASS?.replace(/"/g, '').trim(),
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Payment Gateway" <${process.env.SENDER_EMAIL?.replace(/"/g, '').trim()}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info({ to, messageId: info.messageId }, 'Email sent');
    return info;
  } catch (error) {
    logger.error({ err: error, to }, 'Error sending email');
    throw error;
  }
};

export default transporter;
