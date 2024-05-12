const router = require('express').Router();
const categoryRoutes = require('./category-routes');
const subCategoryRoutes = require('./subCategory-routes');
const productRoutes = require('./product-routes');
const tagRoutes = require('./tag-routes');
const userRoutes = require('./user-routes');
const navBarItemsRoutes = require('./navBarItems-routes');








router.use('/categories', categoryRoutes);
router.use('/subCategories', subCategoryRoutes);
router.use('/products', productRoutes);
router.use('/tags', tagRoutes);
router.use('/user', userRoutes);
router.use('/navbar', navBarItemsRoutes);

module.exports = router;
