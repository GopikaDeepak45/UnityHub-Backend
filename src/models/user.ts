import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

interface Image {
    url: string;
    publicId: string
}
export interface UserInterface extends Document {
    role:string
    userName: string;
    email: string;
    contactNo: string;
    profileImg:Image | null;
    communityId: Schema.Types.ObjectId;
    block: string;
    flatNo: string;
    password: string;
    isVerified:boolean
    isBlocked:boolean
    blockReason:string
}

const userSchema = new Schema<UserInterface>({
    role:{
        type:String,
       default:'user'
    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profileImg:{
        url: String,
        publicId: String
    },
    block: {   
        type: String,
        required: true
    },
    contactNo: {
        type: String,
        required: true
    },
    communityId: {
        type: Schema.Types.ObjectId,
        ref: 'Community',
        required: true
    },
    flatNo: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    blockReason:{
        type:String
    },
});

// Hash password before saving
userSchema.pre<UserInterface>('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error:any) {
        next(error);
    }
});

const User = mongoose.model<UserInterface>('User', userSchema);

export default User;
