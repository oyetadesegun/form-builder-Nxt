import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('SMTP configuration error:', error);
  } else {
    console.log('SMTP server is ready to take messages');
  }
});

export async function sendPasswordResetEmail(email: string, token: string) {
  try {
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;
    
    // Email content
    const mailOptions = {
      from: process.env.SMTP_FROM || '"Your App" <noreply@yourapp.com>',
      to: email,
      subject: 'Reset Your Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    max-width: 600px; 
                    margin: 0 auto; 
                    padding: 20px;
                }
                .header { 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white; 
                    padding: 30px; 
                    text-align: center; 
                    border-radius: 10px 10px 0 0;
                }
                .content { 
                    background: #f8f9fa; 
                    padding: 30px; 
                    border-radius: 0 0 10px 10px;
                    border: 1px solid #e9ecef;
                }
                .button { 
                    background: #667eea; 
                    color: white; 
                    padding: 14px 28px; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    display: inline-block; 
                    font-weight: bold;
                    margin: 20px 0;
                }
                .button:hover {
                    background: #5a6fd8;
                }
                .footer { 
                    text-align: center; 
                    padding: 20px; 
                    color: #6c757d; 
                    font-size: 14px; 
                    margin-top: 20px;
                }
                .code {
                    background: #e9ecef;
                    padding: 10px;
                    border-radius: 5px;
                    font-family: monospace;
                    word-break: break-all;
                    margin: 10px 0;
                }
                .warning {
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 15px 0;
                    color: #856404;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Password Reset Request</h1>
            </div>
            <div class="content">
                <p>Hello,</p>
                <p>You requested to reset your password for your account. Click the button below to create a new password:</p>
                
                <div style="text-align: center;">
                    <a href="${resetLink}" class="button">Reset Your Password</a>
                </div>
                
                <p>Or copy and paste this link in your browser:</p>
                <div class="code">${resetLink}</div>
                
                <div class="warning">
                    <strong>Important:</strong> This password reset link will expire in 1 hour for security reasons.
                </div>
                
                <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
                
                <p>Best regards,<br>Your App Team</p>
            </div>
            <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>&copy; ${new Date().getFullYear()} Your App. All rights reserved.</p>
            </div>
        </body>
        </html>
      `,
      text: `Password Reset Request\n\nHello,\n\nYou requested to reset your password. Please use the following link to reset your password:\n\n${resetLink}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nYour App Team`
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Error sending password reset email:', error);
    
    // For development, log the reset link if email fails
    if (process.env.NODE_ENV === 'development') {
      const resetLink = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;
      console.log('📧 Development mode - Password reset link:');
      console.log(`To: ${email}`);
      console.log(`Reset link: ${resetLink}`);
      return { success: true, development: true };
    }
    
    throw new Error('Failed to send password reset email');
  }
}