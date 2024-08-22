import mongoose from "mongoose";
import { ROLES } from "../constants/index.js"; // Import the ROLES enum

// Base User Schema
const UserSchema = new mongoose.Schema({
  name: {
    // User name
    type: String,
  },
  role: {
    // User role
    type: String,
    enum: Object.values(ROLES).filter((value) => typeof value === "string"),
    required: true,
  },
  isActivated: {
    // Is user activated or not
    type: Boolean,
    default: false,
  },
});

// Customer Schema
const CustomerSchema = new mongoose.Schema({
  ...UserSchema.obj,
  phone: {
    // Customer phone number
    type: Number,
    required: true,
    unique: true,
  },
  role: {
    // Customer role
    type: String,
    enum: [ROLES.CUSTOMER],
    default: ROLES.CUSTOMER,
  },
  liveLocation: {
    // Customer live location
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
  address: {
    // Customer address
    type: String,
  },
});

// DeliveryPartner Schema
const DeliveryPartnerSchema = new mongoose.Schema({
  ...UserSchema.obj,
  email: {
    // Delivery Partner email
    type: String,
    required: true,
    unique: true,
  },
  password: {
    // Delivery Partner password
    type: String,
    required: true,
  },
  phone: {
    // Delivery Partner phone number
    type: Number,
    required: true,
    unique: true,
  },
  role: {
    // Delivery Partner role
    type: String,
    enum: [ROLES.DELIVERY_PARTNER],
    default: ROLES.DELIVERY_PARTNER,
  },
  liveLocation: {
    // Delivery Partner live location
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
  address: {
    // Delivery Partner address
    type: String,
  },
  branch: {
    // Delivery Partner branch
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
  },
});

// Admin Schema
const AdminSchema = new mongoose.Schema({
  ...UserSchema.obj,
  email: {
    // Admin email
    type: String,
    required: true,
    unique: true,
  },
  password: {
    // Admin password
    type: String,
    required: true,
  },
  role: {
    // Admin role
    type: String,
    enum: [ROLES.ADMIN],
    default: ROLES.ADMIN,
  },
});

export const Customer = mongoose.model(ROLES.CUSTOMER, CustomerSchema);
export const DeliveryPartner = mongoose.model(
  ROLES.DELIVERY_PARTNER,
  DeliveryPartnerSchema
);
export const Admin = mongoose.model(ROLES.ADMIN, AdminSchema);
