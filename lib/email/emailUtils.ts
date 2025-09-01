import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
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

export const sendPaymentSuccessEmail = async (
  email: string,
  fullName: string,
  paymentDetails: {
    violationId: string;
    amount: number;
    currency: string;
    paymentDate: string;
    vehicleNumber: string;
    ruleProvision: string;
    placeOfViolation: string;
    violationDate: string;
  }
): Promise<boolean> => {
  try {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "ECop - Payment Successful",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #007bff; margin: 0;">ECop</h1>
            <h2 style="color: #28a745; margin: 10px 0 0 0;">Payment Successful</h2>
          </div>
          
          <div style="padding: 30px 20px;">
            <p style="font-size: 16px; color: #333;">Hello ${fullName},</p>
            
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px; padding: 15px; margin: 20px 0; text-align: center;">
              <h3 style="margin: 0; color: #155724;"> Payment Completed Successfully!</h3>
            </div>
            
            <p style="font-size: 14px; color: #666; line-height: 1.5;">
              Your fine payment has been processed successfully. Here are the details:
            </p>
            
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #007bff; margin: 0 0 15px 0;">Payment Details</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Amount Paid:</td>
                  <td style="padding: 8px 0; color: #333;">Rs. ${
                    paymentDetails.amount
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Payment Date:</td>
                  <td style="padding: 8px 0; color: #333;">${formatDate(
                    paymentDetails.paymentDate
                  )}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Reference ID:</td>
                  <td style="padding: 8px 0; color: #333;">${
                    paymentDetails.violationId
                  }</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #007bff; margin: 0 0 15px 0;">Violation Details</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Vehicle Number:</td>
                  <td style="padding: 8px 0; color: #333;">${
                    paymentDetails.vehicleNumber
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Violation Date:</td>
                  <td style="padding: 8px 0; color: #333;">${formatDate(
                    paymentDetails.violationDate
                  )}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Location:</td>
                  <td style="padding: 8px 0; color: #333;">${
                    paymentDetails.placeOfViolation
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold; vertical-align: top;">Rule Violated:</td>
                  <td style="padding: 8px 0; color: #333;">${
                    paymentDetails.ruleProvision
                  }</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; border-radius: 4px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #0c5460;">
                <strong>Note:</strong> Please keep this email as a record of your payment. Your violation has been marked as paid in our system.
              </p>
            </div>
            
            <p style="font-size: 14px; color: #666; line-height: 1.5;">
              Thank you for using ECop services. Drive safely!
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
    console.error("Error sending payment success email:", error);
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
