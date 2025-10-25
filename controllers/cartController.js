const Cart = require("../models/cartModel");

// Get user cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to load cart", error });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, name, price, image, sellerId, sellerName } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) cart = new Cart({ userId: req.user.id, items: [] });
    cart.items.push({ productId, name, price, image, sellerId, sellerName });
    await cart.save();

    res.json({ message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error });
  }
};

// Remove item
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    await cart.save();

    res.json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ message: "Error removing item", error });
  }
};
