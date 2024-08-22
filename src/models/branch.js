import mongoose from "mongoose";
import { ROLES } from "../constants/index.js";

const BranchSchema = new mongoose.Schema({
  name: {
    // Branch name
    type: String,
    required: true,
  },
  address: {
    // Branch address
    type: String,
  },
  location: {
    // Branch location
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
  deliveryPartners: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: ROLES.DELIVERY_PARTNER,
    },
  ],
});

const Branch = mongoose.model("Branch", BranchSchema);

export default Branch;
