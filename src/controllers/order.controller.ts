import { Request, Response } from "express";
import { ErrorHandler } from "../utils/errorHandler";
import myDataSource from "../config/ecommerceDb";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import { Orders } from "../models/order.model";
import { OrderItems } from "../models/orderItems.model";
import { CART_TYPE, DELIVERY_TYPE, ORDER_STATUS } from "../utils/constants";
import { Product } from "../models/product.model";
import { CartType } from "../models/carttypes.model";
import { DeliveryType } from "../models/deliverytypes";
import { OrderStatus } from "../models/orderstatus.model";
import { In } from "typeorm";
import { makeId } from "../utils/helper";
const OrderItemRepository = myDataSource.getRepository(OrderItems);
const ProductRepository = myDataSource.getRepository(Product);

exports.convertCartToOrder = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client, token, body } = req;
  const id = req.params.id;
  if (isNaN(id)) {
    return next(new ErrorHandler("Cart id cannot be null or undefined", 400));
  }
  let order = await Orders.findOne({
    where: { id: id, cartType: CART_TYPE.CART, clientguid: client.clientguid },
  });

  if (!order) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Order not found",
    });
  }
  const allCartItems = await OrderItemRepository.createQueryBuilder()
    .where({
      orderid: order.id,
    })
    .andWhere({ productid: In(body.productid) })
    .getMany();
  if (!allCartItems) {
    return next(new ErrorHandler("No item found to order", 406));
  }
  await OrderItemRepository.createQueryBuilder()
    .update(OrderItems)
    .set({ cartStatus: CART_TYPE.ORDER })
    .where({ orderid: order.id })
    .andWhere({ productid: In(body.productid) })
    .execute();
  const totalPrice = allCartItems.reduce((acc, el) => (acc += el.price), 0);

  order.cartTotal = totalPrice;
  order.orderNumber = makeId().toString();
  order.cartConvertBy = req.userguid;
  order.cartConvertDate = new Date();
  order.deliveryType = DELIVERY_TYPE.DELIVERY;
  order.orderStatus = ORDER_STATUS.NEW;
  order.trackingNumber = "";
  order.cartType = CART_TYPE.ORDER;
  const saveOrder = await Orders.save(order);
  return res.status(200).json({
    success: true,
    order: saveOrder,
  });
});
exports.getCartInfo = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client, token } = req;

  let order = await Orders.find({
    where: {
      clientguid: client.clientguid,
      cartType: CART_TYPE.CART,
    },
    order: { createdAt: "DESC" },
  });

  if (order.length == 0) {
    return res.status(200).json({
      success: true,
      cartItems: [],
      message: "Cart not found",
    });
  }

  return res.status(200).json({
    success: true,
    cartItems: order,
  });
});
// Get Cart Types
exports.getCartTypes = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const cartTypes = await CartType.find();

  return res.status(200).json({
    success: true,
    cartTypes,
  });
});
// Get Order Status
exports.getOrderStatus = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const orderStatus = await OrderStatus.find();
  return res.status(200).json({
    success: true,
    orderStatus,
  });
});
// Get Delivery Status
exports.getDeliveryTypes = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const deliveryTypes = await DeliveryType.find();
  return res.status(200).json({
    success: true,
    deliveryTypes,
  });
});
// Empty cart list
exports.emptyCart = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client } = req;

  let order = await Orders.findOne({
    where: { cartType: CART_TYPE.CART },
  });
  if (!order) {
    return next(new ErrorHandler("Order not found", 406));
  }
  const allCartItems = await OrderItems.find({
    where: { orderid: order.id },
  });
  if (!allCartItems) {
    return next(new ErrorHandler("no items found for delete", 406));
  }

  const cartIds = allCartItems.map((e) => e.id);
  await OrderItemRepository.createQueryBuilder()
    .update(OrderItems)
    .set({ isDeleted: 1 })
    .where({ id: In(cartIds) })
    .execute();

  const allOrderItems = await OrderItems.createQueryBuilder()
    .softDelete()
    .from(OrderItems)
    .where({ id: In(cartIds) })
    .execute();

  return res.status(200).json({
    success: true,
    allOrderItems,
  });
});
// get single cart item
exports.getSingleCart = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next(new ErrorHandler("Cart id cannot be null or undefined", 400));
  }
  const cart = await OrderItems.find({ where: { orderid: id } });

  if (!cart) {
    return next(new ErrorHandler("Your Cart is empty", 200));
  }

  return res.status(200).json({
    success: true,
    cartItem: cart,
    // cartItem,
  });
});
// Get all orders
exports.getAllOrders = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client, query } = req;
  const allOrdersitems = await Orders.findAndCount({
    where: { cartType: CART_TYPE.ORDER, clientguid: client.clientguid },
    order: { createdAt: "DESC" },
    take: query.take,
    skip: query.skip,
  });
  if (!allOrdersitems) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Order not found",
    });
  }

  return res.status(200).json({
    success: true,
    allOrdersitems,
  });
});
// Get Order Details
exports.getSingleOrder = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client } = req;
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return next(new ErrorHandler("Order id cannot be null or undefined", 400));
  }

  const orderItem = await Orders.findOne({
    where: { id: id, clientguid: client.clientguid, cartType: CART_TYPE.ORDER },
  });
  if (!orderItem) {
    return res.status(200).json({
      success: true,
      orderItem: [],
      message: "Order not found",
    });
  }

  const itemsInOrder = await OrderItems.find({
    where: { orderid: id, cartStatus: CART_TYPE.ORDER },
  });

  return res.status(200).json({
    success: true,
    orderItem,
    itemsInOrder,
  });
});

// Update tracking number
exports.updateTrackingNumber = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client, body } = req;
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next(new ErrorHandler("Order id cannot be null or undefined", 400));
  }
  let order = await Orders.findOne({
    where: { id: id, clientguid: client.clientguid, cartType: CART_TYPE.ORDER },
  });
  if (!order) {
    return next(new ErrorHandler("Order not found", 200));
  }
  order.trackingNumber = body.trackingNumber;
  const savedOrder = await order.save();
  return res.status(200).json({
    success: true,
    message: "Order tracking number has been updated successfully",
  });
});
// Update Order Status
exports.updateOrderStatus = catchAsyncErrors(async function (req, res, next) {
  const { client } = req;
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next(new ErrorHandler("Order id cannot be null or undefined", 400));
  }
  const order = await Orders.findOne({
    where: { id: id, clientguid: client.clientguid, cartType: CART_TYPE.ORDER },
  });
  if (!order) {
    return next(new ErrorHandler("No order found", 406));
  }
  order.orderStatus = req.body.status;
  await Orders.save(order);
  return res.status(200).json({
    success: true,
    message: "Order Status has been updated successfully",
  });
});
// Update Delivery Type
exports.updateDeliveryType = catchAsyncErrors(async function (req, res, next) {
  const { client, body } = req;
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next(new ErrorHandler("Order id cannot be null or undefined", 400));
  }
  const order = await Orders.findOne({
    where: { id: id, clientguid: client.clientguid, cartType: CART_TYPE.ORDER },
  });
  if (!order) {
    return next(new ErrorHandler("No order found", 406));
  }
  order.deliveryType = body.type;
  const updatedOrder = await Orders.save(order);
  return res.status(200).json({
    success: true,
    data: updatedOrder,
    message: "Delivery Type has been updated successfully",
  });
});
