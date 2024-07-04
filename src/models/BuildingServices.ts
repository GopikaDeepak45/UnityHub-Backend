import mongoose, { Schema, Document } from 'mongoose';

// Define a separate interface for the scheduled service
interface ScheduledService {
  scheduledBy: Schema.Types.ObjectId; // Reference to the User ID who scheduled the service
  scheduledAt: Date; // Date/time when the service was scheduled
}

export interface BuildingServiceInterface extends Document {
  name: string;
  description: string;
  communityId: Schema.Types.ObjectId; // Reference to the Community ID
  scheduledTimes: ScheduledService[];
  maxServicesPerHour: number; // Array of scheduled dates/times with scheduling user info
}

const buildingServiceSchema = new Schema<BuildingServiceInterface>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  communityId: {
    type: Schema.Types.ObjectId,
    ref: 'Community', // Reference to Community model
    required: true,
  },
  scheduledTimes: {
    type: [{
      scheduledBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to User model who scheduled the service
        required: true,
      },
      scheduledAt: {
        type: Date,
        default: Date.now,
      },
    }],
    default: [],
  },
  maxServicesPerHour: {
    type: Number,
    default: 1, // Default to 1 service per hour if not specified
  },
});

const BuildingService = mongoose.model<BuildingServiceInterface>('BuildingService', buildingServiceSchema);

export default BuildingService;
