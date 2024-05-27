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
    
}, {
    timestamps: true
});

const Community = mongoose.model('Community', communitySchema);

export default Community;
