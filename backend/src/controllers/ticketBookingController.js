import express from 'express'
import TicketModel from '../models/TicketModel.js'
import StationModel from '../models/StationModel.js'
import { multiFare } from '../utils/fareCalculator.js';
import UserModel from '../models/UserModel.js';
import { sendEmail } from '../utils/sendEmail.js';
export const ticketBooking = async(req,res) => {
  try {
      //  ===1 >> extract from , to and journeyType from the req.body 
        const {from , to , journeyType} = req.body ; 

        const userId  = req.user.id;

        // Check if user has already active ticket
        const statusTest = await TicketModel.findOne({
          user : userId,
          status : "active"
        })
        if(statusTest){
        
          // if active ticket exist , check expiry (if it is expire so we mark it expire before booking new )
          if(statusTest.expiresAt < new Date()){
       // mark it expiry first 
            statusTest.status  = "expire"
            await statusTest.save();
          } else {
            // if the ticket is active but  it is not expired (so we can not marked it expired) 
            return res.status(400).json({message : "You have already an active ticket "})
        }
      }
    
    // Validate Input 
    if(!from || !to){
      return res.status(400).json({message : "From and To stations are required "});
    }
      // if both are same 
      if(from === to){
        return res.status(400).json({message : "From and To stations cannot be same "});
      }

      // Fetch Stations 
      const fromStation = await StationModel.findOne({name : from});
      const toStation = await StationModel.findOne({name : to});
     
      // Validate statiosns
      if(!fromStation || !toStation){
        return res.status(400).json({message : "Invalid Station Selected"})
      }
 
      // Use reusable function (calculateFare)
      const fareDetails = await multiFare(fromStation, toStation, journeyType);

      // Set expiry time of the ticket (90 minutes)
      const expiresAt = new Date(Date.now() + 90 * 60 * 1000);

      // Save ticket with temporary QR code
      const ticket = await TicketModel.create({
        user: userId,
        from: fromStation.name,
        to: toStation.name,
        journeyType,
        distance: fareDetails.distance,
        fare: fareDetails.total,
        expiresAt,
        qrCode: `TICKET_ID:TEMP_${Date.now()}`,
        // qrCode: `${Date.now()}`,
        fareDetails: {
          baseFare: fareDetails.baseFare,
          perKmFare: fareDetails.perKmFare,
          peakMultiplier: fareDetails.peakMultiplier,
          isPeakTime: fareDetails.isPeakTime,
        },
      });

      // Update QR code with actual ticket ID
      // ticket.qrCode = `TICKET_ID:${ticket._id}`;
      ticket.qrCode = `${ticket._id}`;
      await ticket.save();
      // For emailing the user
      const userDoc = await UserModel.findById(req.user.id).select("email");
      if (!userDoc || !userDoc.email) {
        return res.status(404).json({ message: "User not found" });
      }

      // Send email using the user's email from DB
      await sendEmail(userDoc.email, {
        from: ticket.from,
        to: ticket.to,
        fare: ticket.fare,
        ticketId : ticket.qrCode,
        expiresAt : ticket.expiresAt
      });

      // Return success response
      return res.status(201).json({
        success: true,
        message: "Ticket booked successfully",
        ticket: {
          id: ticket._id,
          from: ticket.from,
          to: ticket.to,
          journeyType: ticket.journeyType,
          distance: ticket.distance,
          fare: ticket.fare,
          expiresAt: ticket.expiresAt,
          qrCode: ticket.qrCode,
          status: ticket.status,
        },
        fareBreakdown: {
          baseFare: fareDetails.baseFare,
          perKmFare: fareDetails.perKmFare,
          distance: fareDetails.distance,
          peakMultiplier: fareDetails.peakMultiplier,
          subtotal: fareDetails.subtotal,
          total: fareDetails.total,
          isPeakTime: fareDetails.isPeakTime,
        },
      });

  } catch (error) {
    console.error('Ticket booking error:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message,
      message: "Server error occurred while booking ticket" 
    });
  }
};