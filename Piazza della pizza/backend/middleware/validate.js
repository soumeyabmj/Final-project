const { body, validationResult } = require('express-validator');

const VALID_SIZES    = ['M', 'L', 'XL', 'XXL'];
const VALID_TYPES    = ['Margherita', 'Chicken', 'Tuna', 'Beef', '4 Cheese', 'Veggie'];
const VALID_TOPPINGS = [
  'Tomato sauce', 'Mozzarella', 'Edam', 'Camembert', 'Cheddar',
  'Chicken', 'Tuna', 'Beef', 'Pepperoni',
  'Olive', 'Onion', 'Corn', 'Mushrooms', 'Bell pepper', 'Chilli pepper',
  'Basil'
];

exports.validateOrder = [
  body('size')
    .isIn(VALID_SIZES)
    .withMessage(`Size must be one of: ${VALID_SIZES.join(', ')}`),

  body('type')
    .isIn(VALID_TYPES)
    .withMessage(`Type must be one of: ${VALID_TYPES.join(', ')}`),

  body('toppings')
    .optional()
    .isArray()
    .withMessage('Toppings must be an array')
    .custom(arr => arr.every(t => VALID_TOPPINGS.includes(t)))
    .withMessage('One or more toppings are invalid'),

  body('customer.name')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),

  body('customer.phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+?[\d\s\-().]{9,20}$/)
    .withMessage('Please enter a valid phone number'),

  body('customer.address')
    .trim()
    .notEmpty()
    .withMessage('Delivery address is required')
    .isLength({ max: 300 })
    .withMessage('Address cannot exceed 300 characters'),
  
  //Errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(e => e.msg),
      });
    }
    next();
  },
];
