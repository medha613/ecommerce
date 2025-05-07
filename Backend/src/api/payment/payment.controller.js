const stripe = require("../../util/stripe");
const Cart = require("../../model/cart.model");


const createPaymentIntent = async (req, res) => {
  try {
    const userId = req.user.id;

    //first get the cart details and then calculate the total amount
    const cart = await Cart.findOne({ userId: userId });

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.products.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    // STRIPE PAYMENTINTEND
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, //this to convert into cents
      currency: "usd",
      metadata: { userId: userId, cartId: cart._id.toString() },
    });

    res.status(200).json({
      clienSecret: paymentIntent.client_secret,
      totalAmount,
      message: "Payment intent created",
    });
  } catch (e) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
// recerived---payment intent--client-secret--


module.exports = {
  createPaymentIntent,
};
