const nodemailer = require('nodemailer');

const EMAIL = 'householdsapp@gmail.com';
const PASSWORD = 'IronHack';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: EMAIL,
    pass: PASSWORD
  }
});

transporter
  .sendMail({
    from: `Testing <${EMAIL}>`,
    to: EMAIL,
    subject: 'This is a test',
    html: 'Housekeepo'
  })
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.log(error);
  });
