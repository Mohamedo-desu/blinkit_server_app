const ROLES = Object.freeze({
  CUSTOMER: "Customer",
  DELIVERY_PARTNER: "DeliveryPartner",
  ADMIN: "Admin",
});

const ORDER_STATUS = Object.freeze({
  AVAILABLE: "available",
  CONFIRMED: "confirmed",
  ARRIVING: "arriving",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
});

export { ORDER_STATUS, ROLES };
