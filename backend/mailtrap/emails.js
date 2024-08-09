import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

//Verification EMail
export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    //Send Email using mailtrap
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Email Verification",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email verification",
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    //Error handling
    console.log(`Error sending email, ${error}`);
  }
};

//Welcome Email
export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    //Send Email using mailtrap
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "9318e373-e16d-43e8-a927-7428cff276ae",
      template_variables: {
        company_info_name: "AAuth-Company",
        name: name,
      },
    });
    console.log("Welcome email sent successfully", response);
  } catch (error) {
    //Error handling
    console.log(`Error sending welcome email, ${error}`);
  }
};

//Forgot Password or password Reset Email
export const sendForgotPasswordEmail = async(email, resetURL) => {
  const recipient = [{email}];

  try {
    //Send Email using mailtrap
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Forgot Password Email",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Forgot Password"
    })
    console.log("Forgot password email sent successfully", response);
  } catch (error) {
    //Error handling
    console.log(`Error sending forgot password mail, ${error}`);
  }
}

//Password reset success email
export const sendResetPasswordSuccessEmail = async(email) => {
  const recipient = [{email}];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "password reset success"
    })
  } catch (error) {
    //Error handling
    console.log(`Error sending reset password success email, ${error}`);
  }
}
