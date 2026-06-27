const { Router } = require('express');
const {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');
const { validateOrder } = require('../middleware/validate');

const orderRouter = Router();

orderRouter.get('/',         getAllOrders);
orderRouter.get('/:id',      getOrder);
orderRouter.post('/create',  validateOrder, createOrder);
orderRouter.put('/:id',      updateOrder);
orderRouter.delete('/:id',   deleteOrder);

module.exports = orderRouter;
