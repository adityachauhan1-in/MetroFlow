import nodemailer from "nodemailer"

export const sendEmail = async(userEmail , ticketData)=>{
  console.log("Here is the Email error occur")

    try {
        const transporter = nodemailer.createTransport({
 service : "gmail",
 auth : {
   user : process.env.EMAIL_USER,
   pass : process.env.EMAIL_PASSWORD
 }
        })

        const mailOption = {
          from :   process.env.EMAIL_USER,
          to : userEmail,
          subject : "Your Metro Ticket ",
          html: `
          <h2>Ticket Confirmation</h2>
          <p><strong>From:</strong> ${ticketData.from}</p>
          <p><strong>To:</strong> ${ticketData.to}</p>
          <p><strong>Fare:</strong> ₹${ticketData.fare}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <br/>
          <p>Thank you for booking with Metrio 🚇</p>
        `
        }
        await transporter.sendMail(mailOption)
        console.log("Ticket Email Sent successfully")
    } catch (error) {
      console.log("Here is the Email error occur")
 console.log("Email error " , error)
    }
}