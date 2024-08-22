import mongoose from "mongoose";
import { ORDER_STATUS, ROLES } from "../constants/index.js";
import Counter from "./counter.js";

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ROLES.CUSTOMER,
  },
  deliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ROLES.DELIVERY_PARTNER,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
  },
  items: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      count: {
        type: Number,
        required: true,
      },
    },
  ],
  deliveryLocation: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
    },
  },
  pickupLocation: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
    },
  },
  deliveryPersonLocation: {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    address: {
      type: String,
    },
  },
  status: {
    type: String,
    enum: Object.values(ORDER_STATUS).filter(
      (value) => typeof value === "string"
    ),
    default: ORDER_STATUS.AVAILABLE,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

async function getNextSequenceValue(sequenceName) {
  try {
    const sequenceDocument = await Counter.findOneAndUpdate(
      { name: sequenceName },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
    return sequenceDocument.sequence_value;
  } catch (error) {
    console.log(error);
  }
}

OrderSchema.pre("save", async function (next) {
  if (this.isNew) {
    const sequenceName = "orderId";
    const sequenceValue = await getNextSequenceValue(sequenceName);
    this.orderId = `ORDR${sequenceValue.toString().padStart(5, "0")}`;
  }
  next();
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;
