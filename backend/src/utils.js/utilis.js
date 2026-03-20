import generateotp from 'otp-generator';

function generateOTP() {
    const otp = generateotp.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    return otp;
}

function getopthtml(otp) {
    return `<!DOCTYPE html>
    <html>
        <body>
            <h1>Your OTP Code</h1>
            <p>Your OTP code is: <strong>${otp}</strong></p>
            <p>This code will expire in 10 minutes.</p>
        </body>
    </html>
    `;
}

export { generateOTP, getopthtml };