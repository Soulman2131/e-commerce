import { calcPrices } from "../../Utils/calcPrices.js";
import {
  checkIfNewTransaction,
  verifyPayPalPayment,
} from "../../Utils/paypal.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import { OrderModel } from "../../models/Order.js";
import { ProductModel } from "../../models/Product.js";

// 😍🥰 On rajoute les 2 Utils
// CREATE ORDER  => /api/orders
const addOrder = asyncHandler(async (req, res, next) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    // NOTE: here we must assume that the prices from our client are incorrect.
    // We must only trust the price of the item as it exists in
    // our DB. This prevents a user paying whatever they want by hacking our client
    // side code - https://gist.github.com/bushblade/725780e6043eaf59415fbaf6ca7376ff

    // get the ordered items from our database
    const itemsFromDB = await ProductModel.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    // map over the order items and use the price from our items from database
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    // calculate prices
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      // 🥰😘
      calcPrices(dbOrderItems);

    const order = new OrderModel({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// GET MY ORDERS => /api/orders/mine
const getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await OrderModel.find({ user: req.user._id });
  res.status(200).json(orders);
});

// GET ORDER BY ID  =>  /api/orders/:id
const getMyOrder = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Commande introuvable");
  }
});

// 😍😎Modifié
// UPDATE ORDER (represents in FRONT payORDER) PUT => /api/orders/:id/pay
const updateOrder = asyncHandler(async (req, res, next) => {
  //
  // NOTE: here we need to verify the payment was made to PayPal before marking
  // the order as paid
  const { verified, value } = await verifyPayPalPayment(req.body.id);
  if (!verified) throw new Error("Le paiement n'est pas vérifié");

  // check if this transaction has been used before
  const isNewTransaction = await checkIfNewTransaction(OrderModel, req.body.id);
  if (!isNewTransaction) throw new Error("La transaction est déjà passée");

  const order = await OrderModel.findById(req.params.id);

  if (order) {
    // check the correct amount was paid
    const paidCorrectAmount = order.totalPrice.toString() === value;
    if (!paidCorrectAmount) throw new Error("Le montant est incorrect");

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("La commande est introuvable");
  }
});

export { addOrder, getMyOrders, getMyOrder, updateOrder };
