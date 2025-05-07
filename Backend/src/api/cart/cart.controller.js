const Cart = require("../../model/cart.model");
const Product = require("../../model/product.model");
/*
get product id and qty
and user from the jwtauth
then check if cart for that user is present or not
if not then create an empty one-- with product empty array and total amount of  0
if already present, then check for the product-- if that product exist or not
if exist then just increase the qty if not then push the product in the array
and increase the total amount
*/

const addProductToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    //   first check if product exist or not
    let product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        message: "Product not found",
      });
    }
    let cart = await Cart.findOne({ userId: userId });
    // let cart = await Cart.findOne(userId)

    if (!cart) {
      cart = new Cart({
        userId: userId,
        products: [],
        status: "pending",
        totalAmount: 0,
      });
    }

    // products are simple array- check if cart contain that product
    const ExistingProduct = cart.products.find(
      (product) => product.productId.toString() === productId
    );

    if (ExistingProduct) {
      ExistingProduct.quantity += quantity;
    } else {
      cart.products.push({
        productId: productId,
        quantity: quantity,
        price: product.price,
      });
    }

    cart.totalAmount += product.price * quantity;
    cart.save();
    res.status(200).json({
      message: "Product added to the cart successfully",
      data: cart,
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

// same as the add, just chnage the totalprice according to the provided qty
// in this, same first find if cart present or not.
// if not present then directly return json that cart is not present
// if present then check if thar product id exist or not. if doesn't exsit then same directly return
// if product id present then set qty according to that
// then we have to think about how to to the final total amount


const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res.status(400).json({
        message: "Cart doesn't exist",
        error: e,
      });
    }

    const isExistingProduct = cart.products.find(
      (product) => product.productId.toString() === productId
    );

    if (!isExistingProduct) {
      return res.status(400).json({
        message: "Product doesn't exist",
      });
    }

    // CHECK FOR THE TOTAL PRICE
    // START=====
    let totalprice = 0;
    cart.products.forEach((product) => {
      console.log(product, "PRODUCTTT");
      if (product.productId.toString() === productId) {
        product.quantity += quantity;
        product.price += quantity * isExistingProduct.price;
      }
      totalprice += product.price;
      // incorrect totalAmount calculation
      console.log("===============", product._id, product.price);

      console.log("PRODUCT PRICE=============== TOTALPRICE", totalprice);
      cart.totalAmount = totalprice;
    });

    // ==END====
    await cart.save();
    return res.status(200).json({
      message: "Cart updated successfully",
      data: cart,
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.find({ userId });

    // console.log(cart.products, "CARTTT")
    if (!cart) {
      return res.status(200).json({
        message: "Your cart is empty",
      });
    }

    // for(item of cart.products){
    //   console.log(item, "ITEMMM")
    // }

    return res.status(200).json({
      message: "Cart found successfully",
      data: cart,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// update-- the updated item qty is getting replaced
// clearcart- check what to use, deleteOne or deleteMany
// checkout--- convert the cart to order
// remove item from cart--- this will come inside the update cart-
// if rremoving- reduce the qty and 1 then remove that item from cart

const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.find({ userId });

    if (!cart) {
      return res.status(200).json({
        message: "Cart is not present for deleting",
      });
    }

    await Cart.deleteMany({ userId });

    return res.status(200).json({
      message: "Cart deleted successfully",
    });
  } catch (e) {
    return res.status(500).json({
      message: "Internal server eror",
    });
  }
};

// in checkout, first check if cart is present or not
// if not then return
// if present then check the qty and stock
// if stock is less than qty then return
// else deduct the stocker
// and convert cart status confirm
// and print message checkout successfull

const checkout = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    for (item of cart.products) {
      const product = await Product.findOne({ _id: item.productId });
      if (product.stock < item.quantity) {
        return res.status(200).json({
          message: `${product.name} is out of stock`,
        });
      }
      product.stock -= item.quantity;
    }

    cart.status = "confirmed";
    await Cart.deleteMany({ userId });
    return res.status(200).json({
      message: "Cart has been successfully checkout",
      cart,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  addProductToCart,
  updateCart,
  getCart,
  clearCart,
  checkout,
};
