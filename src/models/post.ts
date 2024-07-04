import mongoose, { Schema, Document } from 'mongoose';
interface Image {
  url: string;
  publicId: string
}
interface MediaInterface {
  data: Image;
  type: 'image' | 'video';
}
interface CommentInterface {
  userId: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

interface PostInterface extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  communityId: mongoose.Types.ObjectId;
  media: MediaInterface[]; // Array of media objects
  createdAt: Date;
  likes: mongoose.Types.ObjectId[]; // Array of user IDs who liked the post
  comments: CommentInterface[];
}

const commentSchema = new Schema<CommentInterface>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const postSchema = new Schema<PostInterface>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  communityId: {
    type: Schema.Types.ObjectId,
    ref: 'Community',
    required: true,
  },
  media: [
    {
      data: {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        }
      },
      type: {
        type: String,
        enum: ['image', 'video'],
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  comments: [commentSchema],
});

const Post = mongoose.model<PostInterface>('Post', postSchema);

export default Post;
