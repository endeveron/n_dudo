import nodemailer from 'nodemailer';

import { gmailTransportConfig, nodemailerUser } from '@/core/config/nodemailer';
import { BASE_URL } from '@/core/constants';
import { BILLING_ACC } from '@/core/features/premium/constants';

export type SendEmailArgs = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

const gmailTransporter = nodemailer.createTransport(gmailTransportConfig);

// See: https://nodemailer.com/message/
export const sendEmail = async (data: SendEmailArgs) => {
  const info = await gmailTransporter.sendMail(data);
  return !!info?.messageId;
};

export const configureVerificationEmail = ({
  email,
  url,
}: {
  email: string;
  url: string;
}): SendEmailArgs => {
  const from = `Games <${nodemailerUser}>`;
  const to = email;
  const subject = 'Confirm Your Email Address';
  const html = `
    <div style="font-family:'Verdana',sans-serif;text-align:center;padding:4rem 0;">
      <h1 style="color:#151518;font-size:2rem;font-weight:bold;margin:0;">
        Email Confirmation
      </h1>
      <p style="color:#5a5a5a;margin-bottom:2rem;margin-top:1rem;">
        Click the button below to confirm your email address
      </p>
      <a style="background-color:#151518;border-radius:32px;color:#ffffff;display:inline-block;font-family:sans-serif;padding:1rem 2rem;font-size:1rem;text-decoration:none;" href="${url}" target="_blank" rel="noopener noreferrer">Confirm</a>
    </div>
  `;

  return {
    from,
    to,
    subject,
    html,
  };
};

export const configureTransactionEmail = ({
  email,
  transactionId,
}: {
  email: string;
  transactionId: string;
}): SendEmailArgs => {
  const from = `Games <${nodemailerUser}>`;
  const to = BILLING_ACC;
  const subject = 'Transaction ID Recieved';
  const html = `
    <div style="font-family:'Verdana',sans-serif;text-align:center;padding:4rem 0;">
      <h1 style="color:#151518;font-size:2rem;font-weight:bold;margin:0;">
        ${transactionId}
      </h1>
      <p style="color:#5a5a5a;margin-bottom:2rem;margin-top:1rem;">
        ${email}
      </p>
      <a style="background-color:#151518;border-radius:32px;color:#ffffff;display:inline-block;font-family:sans-serif;padding:1rem 2rem;font-size:1rem;text-decoration:none;" href="${BASE_URL}/admin?e=${email}&t=${transactionId}" target="_blank" rel="noopener noreferrer">Admin dashboard</a>
    </div>
  `;

  return {
    from,
    to,
    subject,
    html,
  };
};

export const configurePremiumEmail = ({
  email,
}: {
  email: string;
}): SendEmailArgs => {
  const from = `Games <${nodemailerUser}>`;
  const to = email;
  const subject = 'Your premium has been activated!';
  const html = `
    <div style="font-family:'Verdana',sans-serif;text-align:center;padding:4rem 0;">
      <h1 style="color:#00b53a;font-size:2rem;font-weight:bold;margin:0;">
        Congratulations!
      </h1>
      <p style="color:#5a5a5a;margin-bottom:2rem;margin-top:1rem;">
        You now have access to premium features
      </p>
      <a style="background-color:#00ad37;border-radius:32px;color:#ffffff;display:inline-block;font-family:sans-serif;padding:1rem 2rem;font-size:1rem;font-weight:500;text-decoration:none;" href="${BASE_URL}" target="_blank" rel="noopener noreferrer">Let's play</a>
    </div>
  `;

  return {
    from,
    to,
    subject,
    html,
  };
};
