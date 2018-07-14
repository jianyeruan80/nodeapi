var util = require('util');
var nodemailer = require('nodemailer');
var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'jianyeruan@gmail.com',
        pass: 'Kyle1207'
    }
};
 var transporter = nodemailer.createTransport(smtpConfig);
var passwordResetEmailTemplate = '<a href="http://192.168.1.100:90/#/active?e=%s&key=%s">tst</a>';
function sendPasswordResetEmail(emailAddress, authKey) {
   var emailContent = util.format(passwordResetEmailTemplate,emailAddress, authKey);
  transporter.sendMail({
    from: 'jianyeruan@gmail.com',
    to: emailAddress,
    subject: 'Reset Your Password',
    html: emailContent
  },function(err,res){
    if (err) console.log(err);
    
          console.log(res);
   });
   
};
sendPasswordResetEmail("kyleruan1207@gmail.com","test");