import { Schema, model } from "mongoose";
import { IWithdrawal } from "@interfaces";

const withdrawalSchema = new Schema<IWithdrawal>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1  
  },
  wallet: {
    type: {
      walletAddress: String,
      walletNetwork: String,
      coinType: String
    },
    required: true,
    _id: false
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

export default model<IWithdrawal>("Withdrawal", withdrawalSchema);