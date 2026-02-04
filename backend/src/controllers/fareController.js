import StationModel from "../models/StationModel.js"
import { multiFare } from "../utils/fareCalculator.js";
// for calculation of the fare . 
export const calculateFare = async(req,res) => {
try {
    const {from , to , journeyType } = req.body ; 
            
    const fromStation = await StationModel.findOne({name : from})
    const toStation = await StationModel.findOne({name : to})

    if(!fromStation || !toStation){
         return res.status(400).json({message : "Invalid Station Selected "})
    }
     // if both are same 
     if(from === to){
        return res.status(400).json({message : "From and To stations cannot be same "});
      }
// Calculate fare using the resuable function

const fareDetails = await multiFare(fromStation , toStation , journeyType)  
//  Return the details of preview Fare     
res.status(200).json({
    success: true,
    message: "Fare calculated successfully",
    data: {
      from: fromStation.name,
      to: toStation.name,
      distance: fareDetails.distance.toFixed(1),
      baseFare: fareDetails.baseFare,
      perKmFare: fareDetails.perKmFare,
      peakMultiplier: fareDetails.peakMultiplier,
      subtotal: fareDetails.subtotal,
      total: fareDetails.total,
      journeyType: fareDetails.journeyType,
      isPeakTime: fareDetails.isPeakTime
    }
  });
}
catch (err) {
    console.error("Fare calculation error:", err);
    return res.status(500).json({ 
      success: false,
      message: "Error calculating fare",
      error: err.message 
    });
  }
}

// export const 