const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'smohan1029@gmail.com',
    pass: 'uxeqdjgufksgmgnl'
  }
});

const welcomeMail = (email, message) => {
  
    transporter.sendMail({
      from: 'smohan1029@gmail.com',
      to: email,
      subject: 'User registration successful',
      text: message
    }, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}

module.exports = welcomeMail;