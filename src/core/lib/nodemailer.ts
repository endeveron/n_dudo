import nodemailer from 'nodemailer';

import { gmailTransportConfig, nodemailerUser } from '@/core/config/nodemailer';
import { CURRENCY, WELCOME_BONUS } from '@/core/constants';

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
    <div style="font-family:'Verdana',sans-serif;text-align:center;padding:4rem 0;color:#151518;">
      <h1 style="font-size:2rem;font-weight:bold;margin:0;">
        Email Confirmation
      </h1>
      <p style="color:#5a5a5a;margin-bottom:1.5rem;margin-top:3rem;">
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

export const configurePromotionEmail = ({
  email,
  url,
}: {
  email: string;
  url: string;
}): SendEmailArgs => {
  const from = `Games <${nodemailerUser}>`;
  const to = email;
  const subject = `Get ${WELCOME_BONUS} ${CURRENCY} As a Welcome Bonus`;
  const html = `
    <div style="font-family:'Verdana',sans-serif;text-align:center;padding:4rem 0;color:#151518;">
      <h1 style="font-size:2rem;font-weight:bold;line-height:1.25;margin:0;">
        Congratulations!<br />Your welcome bonus is waiting for you.
      </h1>
      <p style="color:#5a5a5a;margin-bottom:1.5rem;margin-top:3rem;">
        Click the button below to activate the welcome bonus program.
      </p>
      <a style="background-color:#151518;border-radius:32px;color:#ffffff;display:inline-block;font-family:sans-serif;padding:1.25rem 3rem;font-size:1.125rem;text-decoration:none;" href="${url}" target="_blank" rel="noopener noreferrer">Get ${WELCOME_BONUS} ${CURRENCY} For Free</a>
    </div>
  `;

  return {
    from,
    to,
    subject,
    html,
  };
};
