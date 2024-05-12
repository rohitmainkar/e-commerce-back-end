const router = require("express").Router();
const { Product, Category,SubCategory, Tag, ProductTag, Images } = require("../../models");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const sequelize = require('../../config/connection')
const { Sequelize } = require('sequelize');



// Multer configuration for handling multiple file uploads
const upload = multer({ 
  dest: 'uploads/', // Destination folder for storing uploaded files
  // limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB per file
});


router.post('/images', upload.array('image', 5), async (req, res) => {
  try {
    const { productId, categoryId, views } = req.body;
    const uploadedImages = req.files;

    // Check if required fields are provided
    if (!productId || !categoryId || !uploadedImages || !views) {
      return res.status(400).json({ message: 'Invalid request data.' });
    }

    // Split the views string into an array of views
    const viewsArray = views.split(',');

    // Process each uploaded image along with its view type
    const savedImages = await Promise.all(viewsArray.map((view, index) => {
      const imageIndex = index; // Assuming imageIndex corresponds to the index in viewsArray
      if (!view || isNaN(imageIndex) || imageIndex < 0 || imageIndex >= uploadedImages.length) {
        return Promise.reject('Invalid view data for an image.');
      }

      const uploadedImage = uploadedImages[imageIndex];
      const unixFilePath = uploadedImage.path.replace(/\\/g, '/');

      // Save the uploaded image data to the database using the Image model
      return Images.create({
        product_id: productId,
        category_id: categoryId,
        view,
        image_url: unixFilePath,
      });
    }));

    res.status(200).json({ message: 'Images uploaded successfully.', data: savedImages });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});





router.get('/images/:view/:productId', async (req, res) => {
  const { productId, view } = req.params;

  try {
    // Query database to fetch one image data based on product ID and view
    const productImage = await Images.findOne({
      where: {
        product_id: productId,
        view: view
      }
    });

    if (!productImage) {
      return res.status(404).json({ message: 'No image found for the specified product ID and view.' });
    }

    // Assuming the product image record in the database has an 'imageUrl' field containing the image path
    const imagePath = productImage.image_url;

    // Set the appropriate content type
    res.set('Content-Type', 'image/jpeg'); // Set the appropriate content type (e.g., image/jpeg, image/png)

    // Send the image
    const fullPath = path.join(__dirname, '../../', imagePath);
    const imageStream = fs.createReadStream(fullPath);
    imageStream.pipe(res);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


router.delete('/images/:view/:productId', async (req, res) => {
  const { productId, view } = req.params;

  try {
    // Delete images based on product ID and view
    const deleteCount = await Images.destroy({
      where: {
        product_id: productId,
        view: view
      }
    });

    if (deleteCount === 0) {
      return res.status(404).json({ message: 'No images found for the specified product ID and view.' });
    }

    res.status(200).json({ message: 'Images deleted successfully.' });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});



router.post("/category", async (req, res) => {
  try {
    const { categoryId } = req.body; // Assuming categoryId is sent in the request body

    // Check if categoryId is provided
    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required." });
    }

    // Find products by category ID
    const productData = await Product.findAll({
      where: { category_id: categoryId }, // Filter products by categoryId
    });

    if (!productData || productData.length === 0) {
      return res.status(404).json({ message: "No product data found for the specified category." });
    }

    res.status(200).json(productData);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: "Internal server error." });
  }
});




// GET all products
router.get("/", async (req, res) => {
  try {
    const productData = await sequelize.query(`
      SELECT 
        p.id,
        p.productName,
        p.price,
        p.stock,
        c.categoryName AS category,
        sc.subcategoryName AS subCategory,
        CONCAT('http://localhost:5000/', (SELECT image_url FROM Images WHERE productId = p.id AND view = 'top')) AS top_view,
        CONCAT('http://localhost:5000/', (SELECT image_url FROM Images WHERE productId = p.id AND view = 'front')) AS front_view
      FROM 
        Product AS p
      LEFT JOIN 
        Category AS c ON p.categoryId = c.id
      LEFT JOIN 
        SubCategory AS sc ON p.subCategoryId = sc.id
    `, { type: sequelize.QueryTypes.SELECT });
  
    if (!productData || productData.length === 0) {
      return res.status(404).json({ message: "No product data found." });
    }

    res.json(productData);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: "Internal server error." });
  }
});

// GET product by id
router.get("/:id", async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Images }],
    });

    if (!productData) {
      return res
        .status(404)
        .json({ message: "No product found with this ID." });
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE product by id
router.delete("/:id", async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: { id: req.params.id }
    });

    if (!productData) {
      return res
        .status(404)
        .json({ message: "No product with this data to delete." });
    }

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST create product
router.post('/', upload.array('image', 5), async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { categoryId, views } = req.body;
    const uploadedImages = req.files;

    // Check if required fields are provided
    if (!uploadedImages || !views) {
      return res.status(400).json({ message: 'Invalid request data.' });
    }

    // Split the views and project details strings into arrays
    const viewsArray = views.split(',');

    // Check if the number of views matches the number of uploaded images
    if (viewsArray.length !== uploadedImages.length) {
      return res.status(400).json({ message: 'Number of views does not match the number of uploaded images.' });
    }

    // Save the product details directly from req.body within the transaction
    const savedProduct = await Product.create(
      req.body ,
      { transaction }
    );
    const productId = savedProduct.id; // Get the generated productId

    // Process each uploaded image along with its view type and project detail within the transaction
    const savedImages = await Promise.all(uploadedImages.map((uploadedImage, index) => {
      const view = viewsArray[index];

      if (!view || isNaN(index) || index < 0) {
        return Promise.reject('Invalid view data for an image.');
      }

      const unixFilePath = uploadedImage.path.replace(/\\/g, '/');

      // Save the uploaded image data to the database using the Images model within the transaction
      return Images.create({
        productId: productId,
        categoryId,
        view,
        image_url: unixFilePath,
      }, { transaction });
    }));

    // Commit the transaction if everything succeeds
    await transaction.commit();

    res.status(200).json({ message: 'Product and images uploaded successfully.', data: { product: savedProduct, images: savedImages } });
  } catch (error) {
    console.error('Error:', error);

    // Rollback the transaction if an error occurs
    await transaction.rollback();

    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.put('/:id', upload.array('image', 5), async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const productId = req.params.id;
    const { categoryId, views } = req.body;
    const uploadedImages = req.files;

    // Check if required fields are provided
    if (!uploadedImages || !views) {
      return res.status(400).json({ message: 'Invalid request data.' });
    }

    // Split the views and project details strings into arrays
    const viewsArray = views.split(',');

    // Check if the number of views matches the number of uploaded images
    if (viewsArray.length !== uploadedImages.length) {
      return res.status(400).json({ message: 'Number of views does not match the number of uploaded images.' });
    }

    // Retrieve the existing product
    const product = await Product.findByPk(productId, { transaction });
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }


         // Delete existing images for the specified views
    if (Array.isArray(viewsArray)) {
      for (const viewToDelete of viewsArray) {
        const existingImages = await Images.findAll({ where: { productId, view: viewToDelete } });
        for (const image of existingImages) {
          // Delete file from the filesystem
          const filePath = image.image_url.replace('http://localhost:5000/', ''); // Assuming image_url contains the absolute file path
          fs.unlinkSync(filePath);
        }
        // Delete images from the database
        await Images.destroy({ where: { productId, view: viewToDelete }, transaction });
      }
    }
    
  
    // Process each uploaded image along with its view type and project detail within the transaction
    const savedImages = await Promise.all(uploadedImages.map((uploadedImage, index) => {
      const view = viewsArray[index];

      if (!view || isNaN(index) || index < 0) {
        return Promise.reject('Invalid view data for an image.');
      }

      const unixFilePath = uploadedImage.path.replace(/\\/g, '/');

      // Save the uploaded image data to the database using the Images model within the transaction
      return Images.create({
        productId,
        categoryId,
        view,
        image_url: unixFilePath,
      }, { transaction });
    }));

    // Commit the transaction if everything succeeds
    await transaction.commit();

    res.status(200).json({ message: 'Product and images updated successfully.', data: { product, images: savedImages } });
  } catch (error) {
    console.error('Error:', error);

    // Rollback the transaction if an error occurs
    await transaction.rollback();

    res.status(500).json({ message: 'Internal server error.' });
  }
});


module.exports = router;


// router.get("/", async (req, res) => {
//   try {
//     const productData = await sequelize.query(`
//       SELECT 
//         p.id,
//         p.productName,
//         p.price,
//         p.stock,
//         c.categoryName AS category,
//         sc.subcategoryName AS subCategory,
//         CONCAT('http://localhost:5000/', (SELECT image_url FROM Images WHERE productId = p.id AND view = 'top')) AS top_view,
//         CONCAT('http://localhost:5000/', (SELECT image_url FROM Images WHERE productId = p.id AND view = 'front')) AS front_view
//       FROM 
//         Product AS p
//       LEFT JOIN 
//         Category AS c ON p.categoryId = c.id
//       LEFT JOIN 
//         SubCategory AS sc ON p.subCategoryId = sc.id
//   `, { type: sequelize.QueryTypes.SELECT });
  
//     if (!productData || productData.length === 0) {
//       return res.status(404).json({ message: "No product data found." });
//     }

//     if (!productData || productData.length === 0) {
//       return res.status(404).json({ message: "No product data found." });
//     }

//     res.json(productData);
//   } catch (err) {
//     console.error(err); // Log the error for debugging
//     res.status(500).json({ message: "Internal server error." });
//   }
// });



// // GET request with id: retrieves data for product with this given id.
// // Also retrieves the associated category, and all the associated tags.
// router.get("/:id", async (req, res) => {
//   try {
//     const productData = await Product.findByPk(req.params.id, {
//       include: [{ model: Category }, { model: Tag }],
//     });

//     if (!productData) {
//       return res
//         .status(404)
//         .json({ message: "No product found with this ID." });
//     }

//     res.status(200).json(productData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });



// // DELETE request with id: destroys the data for the product with this id.
// router.delete("/:id", async (req, res) => {
//   try {
//     const productData = await Product.destroy({
//       where: { id: req.params.id }
//     });

//     if (!productData) {
//       return res
//         .status(404)
//         .json({ message: "No product with this data to delete." });
//     }

//     res.status(200).json(productData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });









// router.post('/', upload.array('image', 5), async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { categoryId, views } = req.body;
//     const uploadedImages = req.files;

//     // Check if required fields are provided
//     if (!uploadedImages || !views) {
//       return res.status(400).json({ message: 'Invalid request data.' });
//     }

//     // Split the views and project details strings into arrays
//     const viewsArray = views.split(',');

//     // Check if the number of views matches the number of uploaded images
//     if (viewsArray.length !== uploadedImages.length) {
//       return res.status(400).json({ message: 'Number of views does not match the number of uploaded images.' });
//     }

//     // Save the product details directly from req.body within the transaction
//     const savedProduct = await Product.create(
//       req.body ,
//       { transaction }
//     );
//     const productId = savedProduct.id; // Get the generated productId

//     // Process each uploaded image along with its view type and project detail within the transaction
//     const savedImages = await Promise.all(uploadedImages.map((uploadedImage, index) => {
//       const view = viewsArray[index];

//       if (!view || isNaN(index) || index < 0) {
//         return Promise.reject('Invalid view data for an image.');
//       }

//       const unixFilePath = uploadedImage.path.replace(/\\/g, '/');

//       // Save the uploaded image data to the database using the Images model within the transaction
//       return Images.create({
//         productId: productId,
//         categoryId,
//         view,
//         image_url: unixFilePath,
//       }, { transaction });
//     }));

//     // Commit the transaction if everything succeeds
//     await transaction.commit();

//     res.status(200).json({ message: 'Images uploaded successfully.', data: savedImages });
//   } catch (error) {
//     console.error('Error:', error);

//     // Rollback the transaction if an error occurs
//     await transaction.rollback();

//     res.status(500).json({ message: 'Internal server error.' });
//   }
// });






// module.exports = router;
