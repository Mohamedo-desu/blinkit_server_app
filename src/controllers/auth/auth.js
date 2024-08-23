import "dotenv/config";
import jwt from "jsonwebtoken";
import { ROLES } from "../../constants/index.js";
import { Customer, DeliveryPartner } from "../../models/index.js";

const generateToken = async (user) => {
  const { _id: userId, role } = user;
  const accessToken = jwt.sign(
    { userId, role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
  const refreshToken = jwt.sign(
    { userId, role },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
  return { accessToken, refreshToken };
};

export const loginCustomer = async (req, res) => {
  try {
    const { phone } = req.body;
    const customer = await Customer.findOneAndUpdate(
      { phone },
      { phone, role: ROLES.CUSTOMER, isActivated: true },
      { new: true, upsert: true }
    );

    const { accessToken, refreshToken } = await generateToken(customer);

    console.log("1");

    return res.send({
      message: "Logged in successfully",
      accessToken,
      refreshToken,
      customer,
    });
  } catch (error) {
    return res.status(500).send({ message: "An error occurred", error });
  }
};

export const loginDeliveryPartner = async (req, res) => {
  try {
    const { email, password } = req.body;
    const deliveryPartner = await DeliveryPartner.findOne({ email });

    if (!deliveryPartner || password !== deliveryPartner.password) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await generateToken(deliveryPartner);

    return res.send({
      message: "Logged in successfully",
      accessToken,
      refreshToken,
      deliveryPartner,
    });
  } catch (error) {
    return res.status(500).send({ message: "An error occurred", error });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).send({ message: "Refresh token required" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const { userId, role } = decoded;

    console.log({ userId, role });

    const user = await (role === ROLES.CUSTOMER
      ? Customer.findById(userId)
      : DeliveryPartner.findById(userId));

    if (!user) {
      return res.status(404).send({ message: "Invalid Refresh Token" });
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateToken(
      user
    );

    return res.send({
      message: "Token refreshed",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res.status(403).send({ message: "Invalid refresh token" });
  }
};

export const fetchUser = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const user = await (role === ROLES.CUSTOMER
      ? Customer.findById(userId)
      : DeliveryPartner.findById(userId));

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    return res.send({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).send({ message: "An error occurred", error });
  }
};
