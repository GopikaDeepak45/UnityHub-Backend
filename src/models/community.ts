import mongoose, { Document, Schema } from "mongoose";
interface Image {
    url: string;
    publicId: string
}
interface ICommunity extends Document {
    name: string
    description?: string;
    location: string
    isBlocked: boolean
    blockReason: string
    members: mongoose.Types.ObjectId[];
    hero: Image | null;
    groups: mongoose.Types.ObjectId[];
}

const communitySchema: Schema<ICommunity> = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    description: String,
    location: {
        type: String,
        required: true
    },

    isBlocked: {
        type: Boolean,
        default: false
    },
    blockReason: {
        type: String
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CommunityMember' }],
    hero: {
        url: String,
        publicId: String
    },

    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }]
}, {
    timestamps: true
});

const Community = mongoose.model('Community', communitySchema);

export default Community;
