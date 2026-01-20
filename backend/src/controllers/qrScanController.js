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

    const ticket =  await TicketModel.findById(ticketId);
    if(!ticket){
 return res.status(404).json({message : "Invalid Ticket"});
    }
    // START PROGRESS FOR VALIDATION

    const now  = new Date();

    // Already used 
    if(ticket.status == "used"){
        return res.status(400).json({message : "Ticket already used "})
    } 
    // Expired by time 
    if(ticket.expiresAt < now){
        ticket.status = "expire";
      await    ticket.save();
   return res.status(400).json({message : "Ticket expired"})
    }
    // Expiry ticket
    if(ticket.status == "expire"){
        return res.status(400).json({message : "Ticket  expired"})

    }
// Valid Ticket and mark it used 

ticket.status = "used";
ticket.usedAt = now;
  await ticket.save();

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
