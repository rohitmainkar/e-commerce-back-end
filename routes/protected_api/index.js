const router = require('express').Router();
const categoryRoutes = require('./category-routes');
const subCategoryRoutes = require('./subCategory-routes');
const productRoutes = require('./product-routes');
const tagRoutes = require('./tag-routes');
const userRoutes = require('./user-routes');
const saleOrderRoutes = require('./saleOrderRoutes');
const customerRoutes = require('./customerRoutes');
const navBarItemsRoutes = require('./navBarItemsRoutes');








router.use('/categories', categoryRoutes);
router.use('/subCategories', subCategoryRoutes);
router.use('/products', productRoutes);
router.use('/tags', tagRoutes);
router.use('/user', userRoutes);
router.use('/navbar', navBarItemsRoutes);
router.use('/saleOrder', saleOrderRoutes);
router.use('/customer', customerRoutes);

module.exports = router;
