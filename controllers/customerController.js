// customerController.js
const { Customer } = require('../models');

// Create a Customer
exports.createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a specific Customer by ID
exports.getCustomerById = async (req, res) => {
  const { customerId } = req.params;
  try {
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a Customer by ID
exports.updateCustomer = async (req, res) => {
  const { customerId } = req.params;
  try {
    const [updated] = await Customer.update(req.body, {
      where: { id: customerId }
    });
    if (!updated) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a Customer by ID
exports.deleteCustomer = async (req, res) => {
  const { customerId } = req.params;
  try {
    const deleted = await Customer.destroy({
      where: { id: customerId }
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(204).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
