import FareConfigModel from "../models/FareConfigModel.js";

export const multiFare = async (fromStation, toStation, journeyType ) => {
    let baseFare = 90;
    let perKmFare = 20;
    let peakMultiplier = 1;
    
    const distance = Math.abs(toStation.distance - fromStation.distance); 
    try {
        const fareConfig = await FareConfigModel.findOne({ isActive: true });
        if (fareConfig) {
          baseFare = fareConfig.baseFare;
          perKmFare = fareConfig.perKmFare;
          
          // Check peak hours 
          // admin will set the peak hours (where metro use maximum ) 
          const currentTime = new Date();
          const currentHour = currentTime.getHours();
          const currentMinutes = currentTime.getMinutes();
          const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;
          
          if (fareConfig.peakStartTime && fareConfig.peakEndTime &&
              currentTimeStr >= fareConfig.peakStartTime && 
              currentTimeStr <= fareConfig.peakEndTime) {
            peakMultiplier = fareConfig.peakMultiplier;
          }
        }
      } catch (error) {
        console.warn('Using default fare values:', error.message);
      }
      
      let total = (baseFare + (distance * perKmFare)) * peakMultiplier;
      
      if (journeyType === "return") {
        total = total * 2;
      }
      
      total = Math.round(total * 100) / 100; // Round to 2 decimal places
      
      return {
        baseFare,
        perKmFare,
        distance,
        peakMultiplier,
        subtotal: baseFare + (distance * perKmFare),
        total,
        isPeakTime: peakMultiplier > 1,
        journeyType
      };
}