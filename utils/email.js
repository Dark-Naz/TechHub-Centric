const nodemailer = require('nodemailer');
const catchAsync = require('./catchAsync');

const sendEmail = catchAsync(async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `TechHub Centric ${process.env.EMAIL_FROM}`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
});

module.exports = sendEmail;
// module.exports = class Email {
//   constructor(user, url) {
//     ((this.to = user.email),
//       (this.firstname = user.firstname.split(' ')[0]),
//       (this.url = url),
//       (this.from = `TechHub Centric ${process.env.EMAIL_FROM}`));
//   }

//   newTransport() {
//     if (process.env.NODE_ENV === 'production') {
//       return 1;
//     }
//   }
// };
