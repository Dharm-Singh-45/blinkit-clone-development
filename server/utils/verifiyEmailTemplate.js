const verifyEmailTemplate = ({ name, url }) => {
  return `
        <p> Dear ${name}</p>
        <P>Thank you for registering Blinkit</p>
        <a href="${url}" 
   style="display: inline-block; 
          color: white; 
          background-color: #007BFF; 
          text-decoration: none; 
          padding: 15px 25px; 
          font-size: 16px; 
          font-weight: bold; 
          border-radius: 5px; 
          margin-top: 10px; 
          text-align: center;">
    Verify Email
</a> `;
};

export default verifyEmailTemplate;
