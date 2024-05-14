// SaleOrderController.js
const { SaleOrder, SaleOrderItem } = require('../models');
const sequelize = require('../config/connection');


// Create a SaleOrder along with SaleOrderItem
exports.createSaleOrder = async (req, res) => {
  const { customerId, totalAmount, discountAmount, taxAmount, finalAmount, shippingAddress, status, items } = req.body;

  try {
    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
      // Create the SaleOrder
      const saleOrder = await SaleOrder.create({
        customerId,
        totalAmount,
        discountAmount,
        taxAmount,
        finalAmount,
        shippingAddress,
        status
      }, { transaction });

      // Create SaleOrderItem
      const createdItems = await Promise.all(items.map(item => SaleOrderItem.create({
        saleOrderId: saleOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        discountAmount: item.discountAmount,
        taxAmount: item.taxAmount,
        totalAmount: item.totalAmount
      }, { transaction })));

      // Commit the transaction
      await transaction.commit();

      res.status(201).json({ saleOrder, saleOrderItems: createdItems });
    } catch (error) {
      // Rollback the transaction if any error occurs
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all SaleOrders with associated SaleOrderItem
exports.getAllSaleOrders = async (req, res) => {
  try {
  //   const data = await sequelize.query(`
  //   SELECT 
  //     so.id AS saleOrderId,
  //     so.customerId,
  //     so.totalAmount,
  //     so.discountAmount,
  //     so.taxAmount,
  //     so.finalAmount,
  //     so.shippingAddress,
  //     so.status
  //   FROM SaleOrders AS so
  // `, { type: sequelize.QueryTypes.SELECT });
  const data = await SaleOrder.findAll({
    include: SaleOrderItem
  });

res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a specific SaleOrder by ID with associated SaleOrderItem
exports.getSaleOrderById = async (req, res) => {
  const { saleOrderId } = req.params;
  try {
    const saleOrder = await SaleOrder.findByPk(saleOrderId, {
      include: SaleOrderItem
    });
    if (!saleOrder) {
      return res.status(404).json({ error: 'Sale Order not found' });
    }
    res.status(200).json(saleOrder);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a SaleOrder by ID along with associated SaleOrderItem
exports.updateSaleOrder = async (req, res) => {
  const { saleOrderId } = req.params;
  const { customerId, totalAmount, discountAmount, taxAmount, finalAmount, shippingAddress, status, items } = req.body;

  try {
    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
      // Update the SaleOrder
      const [updatedSaleOrder] = await SaleOrder.update({
        customerId,
        totalAmount,
        discountAmount,
        taxAmount,
        finalAmount,
        shippingAddress,
        status
      }, {
        where: { id: saleOrderId },
        returning: true,
        transaction
      });

      // Update SaleOrderItem
      await Promise.all(items.map(async item => {
        await SaleOrderItem.update({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          discountAmount: item.discountAmount,
          taxAmount: item.taxAmount,
          totalAmount: item.totalAmount
        }, {
          where: { id: item.id, saleOrderId },
          transaction
        });
      }));

      // Commit the transaction
      await transaction.commit();

      res.status(200).json({ message: 'Sale Order updated successfully' });
    } catch (error) {
      // Rollback the transaction if any error occurs
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a SaleOrder by ID along with associated SaleOrderItem
exports.deleteSaleOrder = async (req, res) => {
  const { saleOrderId } = req.params;

  try {
    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
      // Delete the SaleOrder
      await SaleOrder.destroy({
        where: { id: saleOrderId },
        transaction
      });

      // Delete associated SaleOrderItem
      await SaleOrderItem.destroy({
        where: { saleOrderId },
        transaction
      });

      // Commit the transaction
      await transaction.commit();

      res.status(204).json({ message: 'Sale Order deleted successfully' });
    } catch (error) {
      // Rollback the transaction if any error occurs
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Other controller methods for SaleOrder CRUD operations
