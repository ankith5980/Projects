import nodemailer from 'nodemailer';
import { logger } from '../config/logger.js';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send email
export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${options.fromName || 'Rotary Club Calicut South'} <${
        process.env.EMAIL_FROM || process.env.EMAIL_USER
      }>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
export const emailTemplates = {
  welcome: (name, verificationUrl) => ({
    subject: 'Welcome to Rotary Club of Calicut South',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Rotary Club of Calicut South!</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>Welcome to the Rotary Club of Calicut South Member Portal! We're excited to have you as part of our community.</p>
            <p>To get started, please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email</a>
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #3b82f6;">${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <p>Best regards,<br>Rotary Club of Calicut South</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  passwordReset: (name, resetUrl) => ({
    subject: 'Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #ef4444; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #ef4444;">${resetUrl}</p>
            <div class="warning">
              <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact us if you have concerns.
            </div>
            <p>Best regards,<br>Rotary Club of Calicut South</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  paymentReminder: (name, amount, dueDate, paymentUrl) => ({
    subject: 'Payment Reminder - Membership Fee Due',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .info-box { background: white; border: 2px solid #10b981; padding: 20px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Reminder</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>This is a friendly reminder that your membership fee payment is due.</p>
            <div class="info-box">
              <p><strong>Amount Due:</strong> ₹${amount}</p>
              <p><strong>Due Date:</strong> ${dueDate}</p>
            </div>
            <p>Please click the button below to make your payment:</p>
            <div style="text-align: center;">
              <a href="${paymentUrl}" class="button">Pay Now</a>
            </div>
            <p>Thank you for your continued support of the Rotary Club of Calicut South!</p>
            <p>Best regards,<br>Rotary Club of Calicut South</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  paymentConfirmation: (name, amount, transactionId, receiptUrl) => ({
    subject: 'Payment Received - Thank You!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .success { background: #d1fae5; border: 2px solid #10b981; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Payment Received</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <div class="success">
              <h2>Thank you for your payment!</h2>
              <p><strong>Amount Paid:</strong> ₹${amount}</p>
              <p><strong>Transaction ID:</strong> ${transactionId}</p>
            </div>
            <p>Your payment has been successfully processed. You can download your receipt using the button below:</p>
            <div style="text-align: center;">
              <a href="${receiptUrl}" class="button">Download Receipt</a>
            </div>
            <p>Thank you for your continued support!</p>
            <p>Best regards,<br>Rotary Club of Calicut South</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};
