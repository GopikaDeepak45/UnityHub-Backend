import mongoose, { Document, Schema } from "mongoose";

// Define interface for Community Member document
interface ICommunityMember extends Document {
    fullName: string;
    email: string;
    contactNo: string;
     block: string;
    flatNo: string;
    members: string[];
}

const communityMemberSchema: Schema<ICommunityMember> = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contactNo: {
        type: String,
        required: true
    },
     block: {   
        type: String,
        required: true
    },
    flatNo: {
        type: String,
        required: true
    },
    members: [{
        type: String,
        required: true
    }]
}, {
    timestamps: true
});

const CommunityMember = mongoose.model<ICommunityMember>('CommunityMember', communityMemberSchema);

export default CommunityMember;
