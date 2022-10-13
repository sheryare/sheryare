import express from "express";
const {
  getCartInfo,
  getOrderStatus,
  getDeliveryTypes,
  getCartTypes,
  getAllOrders,
  getSingleOrder,
  getSingleCart,
  convertCartToOrder,
  emptyCart,
  updateTrackingNumber,
  updateDeliveryType,
  updateOrderStatus,
} = require("../controllers/order.controller");
const router = express.Router();

router.route("/carts/all").get(getCartInfo);
router.route("/cart/types").get(getCartTypes);
router.route("/delivery/types").get(getDeliveryTypes);
router.route("/order/status").get(getOrderStatus);
router.route("/orders/all").get(getAllOrders);
router.route("/order/:id").get(getSingleOrder);
router.route("/cart/:id").get(getSingleCart);
router.route("/order/cart-to-order/:id").put(convertCartToOrder);
router.route("/order/update-order-status/:id").put(updateOrderStatus);
router.route("/order/update-order-delivery-type/:id").put(updateDeliveryType);
router.route("/carts/empty-cart").delete(emptyCart);
router.route("/order/update-tracking-number/:id").put(updateTrackingNumber);

export default router;
