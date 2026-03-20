import nodemailer from 'nodemailer';

/**
 * Priority order:
 *  1. Gmail App Password  (EMAIL_USER + EMAIL_APP_PASSWORD)  ← recommended
 *  2. Gmail OAuth2        (EMAIL_USER + CLIENT_ID + CLIENT_SECRET + REFRESH_TOKEN)
 *  3. Ethereal test account (preview URL printed in console)
 *
 * NOTE: transporter is created fresh on every sendEmail call to avoid
 * stale-credential issues when .env changes between server restarts.
 */

const isAppPasswordConfigured = () =>
  Boolean(process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD);

const isOAuth2Configured = () =>
  Boolean(
    process.env.EMAIL_USER &&
      process.env.CLIENT_ID &&
      process.env.CLIENT_SECRET &&
      process.env.REFRESH_TOKEN
  );

const createTransporter = async () => {
  if (isAppPasswordConfigured()) {
    console.log('📧 Using Gmail App Password for emails');
    console.log('   User:', process.env.EMAIL_USER);
    console.log('   Pass set:', !!process.env.EMAIL_APP_PASSWORD);
    return {
      transport: nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      }),
      mode: 'apppassword',
    };
  }

  if (isOAuth2Configured()) {
    console.log('📧 Using Gmail OAuth2 for emails (note: refresh token may expire)');
    return {
      transport: nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.EMAIL_USER,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: process.env.ACCESS_TOKEN,
        },
      }),
      mode: 'oauth2',
    };
  }

  // Fallback: Ethereal test account
  try {
    console.log('🔄 No email credentials found. Generating Ethereal test account...');
    const testAccount = await nodemailer.createTestAccount();
    console.log('✅ Ethereal test account:', testAccount.user);
    return {
      transport: nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: { user: testAccount.user, pass: testAccount.pass },
      }),
      mode: 'ethereal',
    };
  } catch (error) {
    console.error('❌ Failed to create Ethereal account:', error.message);
    return null;
  }
};

const sendEmail = async (to, subject, text, html) => {
  const result = await createTransporter();

  if (!result) {
    return { success: false, error: 'Email service not initialized — no credentials found in .env' };
  }

  const { transport, mode } = result;
  const fromAddress = (mode === 'apppassword' || mode === 'oauth2')
    ? `"Auth System" <${process.env.EMAIL_USER}>`
    : '"Auth System" <noreply@auth.example.com>';

  try {
    const info = await transport.sendMail({ from: fromAddress, to, subject, text, html });

    console.log('✉️  Email sent successfully!');
    console.log('   To:', to);
    console.log('   MessageId:', info.messageId);

    if (mode === 'ethereal') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('\n🔗 ETHEREAL PREVIEW (open in browser — nothing was sent to real inbox):');
      console.log('   ' + previewUrl + '\n');
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    if (error.message.includes('invalid_grant')) {
      console.error('   ➡  OAuth2 refresh token is EXPIRED. Switch to Gmail App Password instead.');
      console.error('   ➡  Add EMAIL_APP_PASSWORD to your .env (from myaccount.google.com/apppasswords)');
    }
    if (error.message.includes('Username and Password') || error.message.includes('Invalid login')) {
      console.error('   ➡  Gmail rejected the App Password. Check it is correct and 2FA is enabled.');
    }
    return { success: false, error: error.message };
  }
};

export default sendEmail;