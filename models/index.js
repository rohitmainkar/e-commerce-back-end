// import models
const Product = require('./Product');
const {Category,SubCategory} = require('./category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');
const Images = require('./Images');
const SaleOrderItem = require('./M_SaleOrderItem');
const SaleOrder = require('./M_SalesOrder');
const Customer = require('./M_Customer');


module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
  Images,
  SubCategory,
  SaleOrder,
  SaleOrderItem,
  Customer,
};
