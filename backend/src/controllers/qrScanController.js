import TicketModel from "../models/TicketModel.js";
// we don't care about who is the user we just care about the ticket(it must be valid)

export const scanTicket = async (req,res) => {
  try {
     
    // CHECK TICKET 
    let { ticketId } = req.body;
    if(!ticketId){
        return res.status(400).json({message : "Ticket Id is required"});
    }
 
    // Allow QR codes that embed the ticket id as "TICKET_ID:<id>"
    if (typeof ticketId === "string" && ticketId.startsWith("TICKET_ID:")) {
      ticketId = ticketId.split("TICKET_ID:")[1];
    }

//     // START PROGRESS FOR VALIDATION

    const now  = new Date();
 

const ticket = await TicketModel.findOneAndUpdate(
  // condition and the update happen together.ss
  {
    _id: ticketId,
    status: "active",
    expiresAt: { $gt: new Date() }
  },
  {
    $set: {
      status: "used",
      usedAt: new Date()
    }
  },
  { new: true }
);
  // await ticket.save();
  if (!ticket) {
    return res.status(400).json({
        message: "Ticket is invalid, expired, or already used."
    });
}

  return res.status(200).json({
    message : "Ticket valid , Entry allowed",
    usedAt : now,
  })

} 
// IF SCAN Failed
catch (error) {
   return res.status(500).json({
    error : error.message , 
    message : "Ticket Scan Failed"}) 
}  
}
