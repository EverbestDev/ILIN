import dotenv from "dotenv";
import SibApiV3Sdk from "sib-api-v3-sdk";

dotenv.config();

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

/**
 * Send email via Brevo API
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} html - email HTML content
 */
const sendEmail = async (to, subject, html) => {
  try {
    const recipients = Array.isArray(to)
      ? to.map((email) => ({ email }))
      : [{ email: to }];
    const sendSmtpEmail = {
      sender: {
        name: "ILI Nigeria",
        email: "olawooreusamahabidemi@gmail.com",
      },
      to: recipients,
      subject,
      htmlContent: html,
    };

    const data = await tranEmailApi.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully:", JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error(
      "Error sending email via Brevo API:",
      error.message,
      error.response?.body || error
    );
    throw error;
  }
};

export default sendEmail;
