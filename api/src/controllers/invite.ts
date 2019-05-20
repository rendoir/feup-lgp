export async function sendMail(req) {
  const nodemailer = require('nodemailer');

  async function email() {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'lgpgrupo3gltt@gmail.com',
        pass: 'abcd@1234',
      },
    });
    // send mail with defined transport object
    const mailOptions = await transporter.sendMail({
      from: '"gNet 💉" <lgpgrupo3gltt@gmail.com>', // sender address
      to: req.body.email, // list of receivers
      subject: 'gNet Invitation', // Subject line
      text: 'Hello, you were invited to join gNet Platform. You can join it at this link: http://voidlab.fe.up.pt/', // plain text body
      html: '<b>Hello, you were invited to join gNet Platform. You can join it at this link: http://voidlab.fe.up.pt/</b>', // html body
    });

    transporter.sendMail(mailOptions);
  }
  email().catch(console.error);
}
