import { Schema, model } from "mongoose";
import { IDeposit } from "@interfaces";

const depositSchema = new Schema<IDeposit>({
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

export default model<IDeposit>("Deposit", depositSchema);