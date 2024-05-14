// routes/saleOrderRoutes.js
const express = require('express');
const router = express.Router();
const saleOrderController = require('../../controllers/saleOrderController');

// Create a new sale order item
router.post('/', saleOrderController.createSaleOrder);

router.get('/', saleOrderController.getAllSaleOrders);

// Get a specific sale order item by ID
router.get('/:saleOrderId', saleOrderController.getSaleOrderById);

// Update a specific sale order item by ID
router.put('/:saleOrderId', saleOrderController.updateSaleOrder);

// Delete a specific sale order item by ID
router.delete('/:saleOrderId', saleOrderController.deleteSaleOrder);


module.exports = router;
