// Use dynamic import to avoid CommonJS/ES module conflicts
let nodemailer;

async function initializeNodemailer() {
  if (!nodemailer) {
    const nodemailerModule = await import('nodemailer');
    nodemailer = nodemailerModule.default;
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if environment variables are set
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('Gmail credentials not configured');
    return res.status(500).json({ 
      error: 'Email service not configured',
      details: 'Gmail credentials missing in environment variables'
    });
  }

  try {
    // Initialize nodemailer
    await initializeNodemailer();

    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Name, email, subject, and message are all required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format',
        details: 'Please provide a valid email address'
      });
    }

    console.log('Creating email transporter...');

    // Create transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log('Email transporter verified successfully');

    // Email to you (the website owner)
    const mailOptionsToOwner = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Send to yourself
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #374151;">Message:</h3>
            <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #3b82f6; border-radius: 4px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
            <p>This message was sent from your portfolio contact form.</p>
            <p>Reply directly to this email to respond to ${name}.</p>
          </div>
        </div>
      `,
      replyTo: email, // Allow direct reply to the sender
    };

    // Auto-reply to the person who submitted the form
    const autoReplyOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: `Thanks for reaching out! - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            Thanks for your message!
          </h2>
          
          <p>Hi ${name},</p>
          
          <p>Thank you for reaching out through my portfolio website. I've received your message and will get back to you as soon as possible.</p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Your message:</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <div style="background-color: #ffffff; padding: 10px; border-left: 3px solid #3b82f6;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <p>I typically respond within 24-48 hours. If your inquiry is urgent, feel free to connect with me on <a href="https://www.linkedin.com/in/harmanpunn/" style="color: #3b82f6;">LinkedIn</a>.</p>
          
          <p>Best regards,<br>
          <strong>Harmanpreet Singh</strong></p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
            <p>This is an automated response from harmanpunn.me</p>
          </div>
        </div>
      `,
    };

    console.log('Sending emails...');

    // Send both emails
    await Promise.all([
      transporter.sendMail(mailOptionsToOwner),
      transporter.sendMail(autoReplyOptions)
    ]);

    console.log('Emails sent successfully');

    return res.status(200).json({ 
      success: true,
      message: 'Message sent successfully! You should receive a confirmation email shortly.'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    
    // Handle specific nodemailer errors
    if (error.code === 'EAUTH') {
      return res.status(500).json({ 
        error: 'Email authentication failed',
        details: 'Please check Gmail credentials and app password'
      });
    }
    
    if (error.code === 'ENOTFOUND') {
      return res.status(500).json({ 
        error: 'Email service unavailable',
        details: 'Could not connect to Gmail servers'
      });
    }

    return res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message || 'Unknown error occurred'
    });
  }
}