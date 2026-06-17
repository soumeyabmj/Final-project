const Order = require('../model/order');

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