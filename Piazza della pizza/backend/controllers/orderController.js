const Order = require('../model/order');

//POST api orders/create
exports.createOrder = async (req, res) => {
  try {
    const { size, type, toppings, customer } = req.body;

    const order = await Order.create({ size, type, toppings, customer });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! We will contact you to confirm.',
      data: {
        ticketNumber: order.ticketNumber,
        size:         order.size,
        type:         order.type,
        toppings:     order.toppings,
        customer:     order.customer,
        totalPrice:   order.totalPrice,
        status:       order.status,
        statusLabel:  order.statusLabel,
        createdAt:    order.createdAt,
      },
    });

  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }
    console.error('createOrder error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

//GET api/orders 
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    console.error('getAllOrders error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

//GET api - orders id
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    console.error('getOrder error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

//PUT api - orders id
exports.updateOrder = async (req, res) => {
  try {
    const allowedUpdates = ['status'];
    const updates = {};
    allowedUpdates.forEach(key => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    console.error('updateOrder error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

//DELETE api - orders id
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (err) {
    console.error('deleteOrder error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};
