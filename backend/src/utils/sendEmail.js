import nodemailer from "nodemailer";

export const sendEmail = async (userEmail, ticketData) => {
  
  // console.log("[sendEmail] called with:", {
  //   userEmail,
  //   from: ticketData.from,
  //   to: ticketData.to,
  //   fare: ticketData.fare,
  //   ticket : ticketData.ticketId,
  //   expire : ticketData.expiresAt
  // });

  // console.log("[sendEmail] env EMAIL_USER present:", !!process.env.EMAIL_USER);
  // console.log("[sendEmail] env EMAIL_PASSWORD present:", !!process.env.EMAIL_PASSWORD);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // must be App Password if 2FA on
      },
      logger: true, // nodemailer logs to console
      debug: true,  // detailed SMTP logs
    });

    // Check connection before sending
    await transporter.verify();
    console.log("[sendEmail] transporter verified OK");

    const mailOption = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Your Metro Ticket",
      html: `
        <h1>Ticket Confirmation</h1>
        <h2><strong>From:</strong> ${ticketData.from}</h2>
        <h2><strong>To:</strong> ${ticketData.to}</h2>
        <h2><strong>Fare:</strong> ₹${ticketData.fare}</h2>
        <h2><strong>TicketId:</strong> ${ticketData.ticketId}</h2>
        <h2><strong>Date:</strong> ${new Date().toLocaleString()}</h2>
        <h4><strong>Valid only till : </strong> ${ticketData.expiresAt}</h4>
        <br/>
        <h1>Thank you for booking with MetroFlow 🚇</h1>
      `,
    };

    const info = await transporter.sendMail(mailOption);
    // console.log("[sendEmail] email sent:", info.messageId, info.response);
  } catch (error) {
    console.error("[sendEmail] EMAIL ERROR:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
    });
    throw error; // optional: rethrow so controller 500s
  }
};