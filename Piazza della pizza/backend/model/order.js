const mongoose = require('mongoose');

//Allowed values
const Sizes    = ['M', 'L', 'XL', 'XXL'];
const Types    = ['Margherita', 'Chicken', 'Tuna', 'Beef', '4 Cheese', 'Veggie'];
const Toppings = [
  'Tomato sauce', 'Mozzarella', 'Edam', 'Camembert', 'Cheddar',
  'Chicken', 'Tuna', 'Beef', 'Pepperoni', 'Olive', 'Onion',
  'Corn', 'Mushrooms', 'Bell pepper', 'Chilli pepper', 'Basil',
];

//Pricing
const Prices         = { M: 500, L: 1000, XL: 1500, XXL: 2000 };
const Toppings_price = 50;

//Schema
const orderSchema = new mongoose.Schema(
  {
    // Pizza
    size: {
      type: String,
      enum: Sizes,                               
      required: [true, 'Pizza size is required'],
    },
    type: {
      type: String,
      enum: Types,                        
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

    //Customer
    customer: {
      name: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
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
        maxlength: [200, 'Address cannot exceed 200 characters'],
      },
    },

    //Pricing 
    basePrice:     { type: Number },
    toppingsPrice: { type: Number },
    totalPrice:    { type: Number },

    //Order status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'],
      default: 'pending',
    },

    // Unique ticket identifier
    ticketNumber: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Virtual (human-readable status label)
const STATUS_LABELS = {
  pending:    'Awaiting confirmation',
  confirmed:  'Confirmed',
  preparing:  'Being prepared',
  delivered:  'Delivered',
  cancelled:  'Cancelled',
};
orderSchema.virtual('statusLabel').get(function () {
  return STATUS_LABELS[this.status] || this.status;
});
orderSchema.set('toJSON', { virtuals: true });

// Generate ticket and total prices 
orderSchema.pre('save', async function () {
  if (this.isNew) {
    //Ticket
    const makeTicket = () => {
      const date   = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const random = Math.floor(1000 + Math.random() * 9000);
      return `#${date}-${random}`;
    };

    let ticket = makeTicket();
    const existing = await mongoose.model('Order').findOne({ ticketNumber: ticket });
    if (existing) ticket = makeTicket();   // one retry on the rare collision
    this.ticketNumber = ticket;

    //Pricing
    this.basePrice     = Prices[this.size] || 0;
    this.toppingsPrice = this.toppings.length * Toppings_price;
    this.totalPrice    = this.basePrice + this.toppingsPrice;
  }
});

module.exports = mongoose.model('Order', orderSchema);
