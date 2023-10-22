const SibApiV3Sdk = require('sib-api-v3-sdk');
const forgotPassword = async(req,res)=>
{
    const {email}= req.body;
// Create an instance of the API client and set your API key
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = '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';

const sender = {
  email: 'ayushnigam95530@gmail.com', // Use a verified sender email from your SendinBlue account
  name: 'Ayush Nigam', // Sender's name (optional)
};

const receivers = [
  {
    email: email, // Recipient's email
  },
];

const transactionalEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const emailData = {
  subject: 'Expense Tracker - Forgot Password Link',
  sender,
  to: receivers,
  htmlContent: `
    <h1>Become a frontend developer</h1>
    <a href='https://cules-coding.vercel.app/'>Cules Coding</a>
  `,
  params: {
    role: 'frontend',
  },
};

transactionalEmailApi
  .sendTransacEmail(emailData)
  .then((result) => {
    res.status(200).json({success: result})
    console.log('Email sent successfully:', result);
  })
  .catch((error) => {
    console.error('Error sending email:', error);
  });


}
module.exports = {
    forgotPassword,
}