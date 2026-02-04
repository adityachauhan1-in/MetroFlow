import mongoose  from "mongoose";

const fareConfigSchema = new mongoose.Schema({
   baseFare : {
    type : Number,
    required : true,
    min : 0 
   },
   perKmFare : {
    type : Number,
    required  : true,
    min:0
   },
  peakMultiplier : {
    type : Number,
    required : true,
    min : 1
   },
   peakStartTime : {
    type : String , 
   required : true,
   validate: {
    validator: function(value) {
      // Validate HH:MM format (24-hour format)
      return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
    },
    message: 'Peak start time must be in HH:MM format (24-hour)'
  }
   },
   peakEndTime : {
    type : String ,
    required: true,
    validate: {
        validator: function(value) {
          // Validate HH:MM format (24-hour format)
          return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
        },
        message: 'Peak end time must be in HH:MM format (24-hour)'
      }
   }, 
   isActive : {
    type: Boolean,
    default : true
   }


},
{
    timestamps : true
})
// for checking the format of the time 
fareConfigSchema.pre('save', function(next) {
    // Ensure times have leading zeros if needed (e.g., 9:00 -> 09:00)
    const formatTime = (time) => {
      if (!time) return time;
      const [hours, minutes] = time.split(':');
      return `${hours.padStart(2, '0')}:${minutes}`;
    };
    
    if (this.peakStartTime) {
      this.peakStartTime = formatTime(this.peakStartTime);
    }
    if (this.peakEndTime) {
      this.peakEndTime = formatTime(this.peakEndTime);
    }
    
    next();
})
export default mongoose.model("FareConfig" , fareConfigSchema)