import TicketModel from "../models/TicketModel.js";

export const autoExpireTicket = async () => {
    try {
        const result = await TicketModel.updateMany({
            status : "active",
            expiresAt : { $lt : new Date()}
        } ,{
     $set   : {  status:"expire"}  } 
      )
      console.log(`Expired ${result.modifiedCount} old ticket`)
      return result
    } catch (error) {
        console.error("Ticket expiration cleanup failed:", error);
    }
}