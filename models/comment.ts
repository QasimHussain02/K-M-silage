import mongoose, { Schema, Document, Types } from "mongoose";

export interface IComment extends Document {
  blogId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  userEmail?: string;
  content: string;
  isEdited?: boolean;
  isDeleted?: boolean;
  likesCount?: number;
  parentId?: Types.ObjectId | null;
  status?: "published" | "pending" | "flagged" | "removed";
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema<IComment>(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userName: { type: String, required: true },
    userEmail: { type: String },
    content: { type: String, required: true },
    isEdited: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    likesCount: { type: Number, default: 0 },
    parentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    status: {
      type: String,
      enum: ["published", "pending", "flagged", "removed"],
      default: "published",
    },
  },
  { timestamps: true }
); // Compound index for fetching by blog, newest first
CommentSchema.index({ blogId: 1, createdAt: -1 });
const Comment =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;
