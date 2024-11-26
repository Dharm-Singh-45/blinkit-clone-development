const forgotPasswordTemplate = ({ name, otp }) => {
    return `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <p style="font-size: 18px; font-weight: bold;">Dear ${name},</p>
        <p>You have requested a password reset. Please use the following OTP code to reset your password:</p>
        <p style="font-size: 24px; font-weight: bold; color: #4CAF50; margin: 10px 0;">${otp}</p>
        <p>This OTP is valid for 1 hour only.</p>
        <br />
        <p>Thanks,</p>
        <p>blinkIt Team</p>
      </div>
    `;
  };


  export default forgotPasswordTemplate
  