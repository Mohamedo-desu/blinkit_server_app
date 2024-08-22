import { ORDER_STATUS } from "../../constants/index.js";
import {
  Branch,
  Customer,
  DeliveryPartner,
  Order,
} from "../../models/index.js";

export const createOrder = async (req, res) => {
  try {
    const { userId } = req.user;
    const { items, branch, totalPrice } = req.body;

    const customerData = await Customer.findById(userId);
    const branchData = await Branch.findById(branch);

    if (!customerData) {
      return res.status(404).send({ message: "Customer not found" });
    }
    if (!branchData) {
      return res.status(404).send({ message: "Branch not found" });
    }

    const newOrder = new Order({
      customer: userId,
      items: items.map((item) => ({
        id: item.id,
        item: item.item,
        count: item.count,
      })),
      branch,
      totalPrice,
      deliveryLocation: {
        latitude: customerData.liveLocation.latitude,
        longitude: customerData.liveLocation.longitude,
        address: customerData.address || "No address available",
      },
      pickupLocation: {
        latitude: branchData.location.latitude,
        longitude: branchData.location.longitude,
        address: branchData.address || "No address available",
      },
    });

    const savedOrder = await newOrder.save();
    return res.status(201).send({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    return res.status(500).send({ message: "An error occurred", error });
  }
};

export const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.user;
    const { deliveryPersonLocation } = req.body;

    const deliveryPerson = await DeliveryPartner.findById(userId);

    if (!deliveryPerson) {
      return res.status(404).send({ message: "Delivery person not found" });
    }
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    if (order.status !== ORDER_STATUS.AVAILABLE) {
      return res.status(400).send({ message: "Order is not available" });
    }

    order.status = ORDER_STATUS.CONFIRMED;
    order.deliveryPartner = userId;
    order.deliveryPersonLocation = deliveryPersonLocation;
    await order.save();

    return res.send({ message: "Order confirmed successfully", order });
  } catch (error) {
    return res.status(500).send({ message: "Failed to confirm order", error });
  }
};
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.user;

    const { status, deliveryPersonLocation } = req.body;

    const deliveryPerson = await DeliveryPartner.findById(userId);

    if (!deliveryPerson) {
      return res.status(404).send({ message: "Delivery person not found" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    if (
      [ORDER_STATUS.CANCELLED, ORDER_STATUS.DELIVERED].includes(order.status)
    ) {
      return res.status(400).send({ message: "Order can not be updated" });
    }

    if (order.deliveryPartner.toString() !== userId) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    order.status = status;
    order.deliveryPersonLocation = deliveryPersonLocation;

    await order.save();

    return res.send({ message: "Order status updated successfully", order });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Failed to update order status", error });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { status, customerId, deliveryPartnerId, branchId } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    if (customerId) {
      query.customer = customerId;
    }

    if (deliveryPartnerId) {
      query.deliveryPartner = deliveryPartnerId;
    }

    if (branchId) {
      query.branch = branchId;
    }

    const orders = await Order.find(query).populate(
      "customer branch deliveryPartner items.item"
    );

    return res.send({
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Failed to retrieve orders", error });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate(
      "customer branch deliveryPartner items.item"
    );

    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    return res.send({ message: "Order retrieved successfully", order });
  } catch (error) {
    return res.status(500).send({ message: "Failed to retrieve order", error });
  }
};
