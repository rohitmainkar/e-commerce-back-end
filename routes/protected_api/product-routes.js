const router = require("express").Router();
const { Product, Category, Tag, ProductTag, Images } = require("../../models");
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






router.get("/", async (req, res) => {
  try {
    const productData = await sequelize.query(
       `SELECT 
       P.id AS product_id,
       P.product_name,
       P.price,
       P.stock,
       CONCAT('http://192.168.1.196:5000/', T.image_url) AS top_view,
       CONCAT('http://192.168.1.196:5000/', F.image_url) AS front_view
   FROM 
       Product AS P
   INNER JOIN 
       Images AS T ON P.id = T.product_id AND T.view = 'top'
   LEFT JOIN 
       Images AS F ON P.id = F.product_id AND F.view = 'front';
        `, { type: Sequelize.QueryTypes.SELECT }
    );

    if (!productData || productData.length === 0) {
      return res.status(404).json({ message: "No product data found." });
    }

    if (!productData || productData.length === 0) {
      return res.status(404).json({ message: "No product data found." });
    }

    res.json(productData);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: "Internal server error." });
  }
});



// GET request with id: retrieves data for product with this given id.
// Also retrieves the associated category, and all the associated tags.
router.get("/:id", async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
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



router.post("/", (req, res) => {

  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// PUT request with id: update product data for the product with this id.
router.put("/:id", (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// DELETE request with id: destroys the data for the product with this id.
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

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
