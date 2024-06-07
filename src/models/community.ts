import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        
    },
    location: {
        type: String,
        required: true
    },
    
    isBlocked:{
        type:Boolean,
        default:false
    },
    blockReason:{
        type:String
    }
}, {
    timestamps: true
});

const Community = mongoose.model('Community', communitySchema);

export default Community;
