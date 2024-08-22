const nodemailer = require("nodemailer");

// Create a transporter using Ethereal's SMTP server
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'andy.greenholt@ethereal.email',
        pass: 'etjyQha8gntZpAEY2T'
    }
});

// Async function to send an email
async function sendEmail(email) {
  try {
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // Sender address
      to: email, // List of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // Plain text body
      html: "<b>Hello world?</b>", // HTML body
    });

    console.log("Message sent: %s", info.messageId); // Log the message ID
  } catch (error) {
    console.error("Failed to send email:", error); // Handle any errors
  }
}

// Call the async function
sendEmail('k_zeinev@abv.bg');
