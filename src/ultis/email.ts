import nodemailer from 'nodemailer';
import config from '../config/index'

export const sendEmail = async (options: { email: any; subject: any; message: any; }) => {
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    auth: {
      user: config.smtpUsername,
      pass: config.smtpPassword
    }
  });

  const mailOptions = {
    from: 'Password Reset <ecommerce@example.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  await transporter.sendMail(mailOptions);
};

