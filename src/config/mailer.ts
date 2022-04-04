import nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, //++Segurity //587,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'angel9982224351@gmail.com', // generated ethereal user
        pass: 'wwvbiverxqwdklje', // generated ethereal password
    },
});

transporter.verify().then(() => {
    console.log('Listo para mandar el correo');
});
