// lib/email/emailUtils.ts
import nodemailer from "nodemailer";

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // Your email
    pass: process.env.SMTP_PASS, // Your email password or app password
  },
});

// Generate temporary password
export const generateTemporaryPassword = (): string => {
  const chars = "0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

// Send temporary password email
export const sendTemporaryPasswordEmail = async (
  email: string,
  fullName: string,
  temporaryPassword: string
): Promise<boolean> => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "ECop - Your Temporary Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #007bff; margin: 0;">ECop</h1>
            <h2 style="color: #333; margin: 10px 0 0 0;">Temporary Password</h2>
          </div>
          
          <div style="padding: 30px 20px;">
            <p style="font-size: 16px; color: #333;">Hello ${fullName},</p>
            
            <p style="font-size: 14px; color: #666; line-height: 1.5;">
              Welcome to ECop! Your temporary password for first-time login has been generated.
            </p>
            
            <div style="background-color: #f8f9fa; border: 2px solid #007bff; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your Temporary Password:</p>
              <h2 style="margin: 0; font-size: 32px; color: #007bff; letter-spacing: 8px; font-weight: bold;">${temporaryPassword}</h2>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #856404;">
                <strong>Important:</strong> This temporary password will expire in 15 minutes. Please use it to log in and set up your new password immediately.
              </p>
            </div>
            
            <p style="font-size: 14px; color: #666; line-height: 1.5;">
              For security reasons, you will be required to change this password after your first login.
            </p>
            
            <p style="font-size: 14px; color: #666;">
              If you didn't request this password, please ignore this email.
            </p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #999;">
            <p style="margin: 0;">This is an automated message from ECop System.</p>
            <p style="margin: 5px 0 0 0;">Please do not reply to this email.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// Verify email configuration
export const verifyEmailConfig = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error("Email configuration error:", error);
    return false;
  }
};
