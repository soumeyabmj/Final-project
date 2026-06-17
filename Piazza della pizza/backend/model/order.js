const mongoose = require('mongoose');

const Sizes   = ['M', 'L', 'XL', 'XXL'];
const Types    = ['Margherita', 'Chicken', 'Tuna', 'Beef', '4 Cheese', 'Veggie'];
const Toppings = ['Tomato sauce', 'Mozzarella', 'Edam', 'Camembert', 'Cheddar',
  'Chicken', 'Tuna', 'Beef', 'Pepperoni','Olive', 'Onion', 
  'Corn', 'Mushrooms', 'Bell pepper', 'Chilli pepper','Basil' ];

const Prices = { M: 500, L: 1000, XL: 1500, XXL: 2000 };
const Toppings_price = 50;

import { Schema, model } from "mongoose";
const orderSchema = new Schema(
 {
    // Pizza
    size: {
      type: String,
      enum: sizes,
      required: [true, 'Pizza size is required'],
    },
    type: {
      type: String,
      enum: types,
      required: [true, 'Pizza type is required'],
    },
    toppings: {
      type: [String],
      validate: {
        validator: (arr) => arr.every(t => Toppings.includes(t)),
        message: 'One or more toppings are invalid',
      },
      default: [],
    },

    // Customer
    customer: {
      name: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
        maxlength: [100, 'Name can not exceed 100 characters'],
      },
      phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^\+?[\d\s\-().]{9,20}$/, 'Please enter a valid phone number'],
      },
      address: {
        type: String,
        required: [true, 'Delivery address is required'],
        trim: true,
        maxlength: [200, 'Address can not exceed 300 characters'],
      },
    },

    // Pricing
    basePrice: { type: Number },
    toppingsPrice: { type: Number },
    totalPrice: { type: Number },
    ticketNumber: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Auto-generate ticket number & compute price before save
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Generate ticket: #YYYYMMDD-XXXX
    const date   = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(1000 + Math.random() * 9000);
    this.ticketNumber = `#${date}-${random}`;

    // Compute price
    this.basePrice     = Prices[this.size] || 0;
    this.toppingsPrice = this.toppings.length * Toppings_price;
    this.totalPrice    = this.basePrice + this.toppingsPrice;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
