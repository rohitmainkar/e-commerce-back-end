const express = require('express');
const router = express.Router();
const { NavBarItem, NavBarSubItems } = require('../../models/M_NavBar');
const sequelize = require('../../config/connection');


const multer = require('multer');
const upload = multer({ dest: 'navImages/' }); // Adjust destination folder as per your requirement

router.post('/', upload.array('image', 5), async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const image = req.file;
    const imagePath = image ? image.path.replace(/\\/g, '/') : null; 

    const navBarItem = await NavBarItem.create({
      title: req.body.title,
      produtCatrgory: req.body.produtCatrgory,
      produtsubCatrgory: req.body.produtsubCatrgory,
      displayImage: imagePath,
      displayIndex: req.body.displayIndex,
      isActive: req.body.isActive,
      link_url: req.body.link_url,
    }, { transaction });

     await transaction.commit();
    res.status(201).json(navBarItem);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ message: error.message });
  }
});


// Read All NavBar Items
router.get('/items', async (req, res) => {
  try {
    const navBarItems = await NavBarItem.findAll({
      iinclude: NavBarSubItems 
    });
    res.status(200).json(navBarItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Read Single NavBar Item
router.get('/items/:id', async (req, res) => {
  try {
    const navBarItem = await NavBarItem.findByPk(req.params.id, {
      include: [{ model: NavBarSubItems }]
    });
    if (!navBarItem) return res.status(404).json({ message: 'NavBarItem not found' });
    res.status(200).json(navBarItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update NavBar Item
router.put('/items/:id', async (req, res) => {
  try {
    const navBarItem = await NavBarItem.findByPk(req.params.id);
    if (!navBarItem) return res.status(404).json({ message: 'NavBarItem not found' });

    await navBarItem.update(req.body);
    res.status(200).json(navBarItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete NavBar Item
router.delete('/items/:id', async (req, res) => {
  try {
    const navBarItem = await NavBarItem.findByPk(req.params.id);
    if (!navBarItem) return res.status(404).json({ message: 'NavBarItem not found' });

    await navBarItem.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// NavBarSubItems CRUD

// Create NavBar SubItem
router.post('/subitems', upload.single('image'), async (req, res) => {
    try {
      const image = req.file;
      const imagePath = image ? image.path.replace(/\\/g, '/') : null; 
        
      const navBarSubItem = await NavBarSubItems.create({
        title: req.body.title,
        navBarId: req.body.navBarId,
        displayImage: imagePath,
        displayIndex: req.body.displayIndex,
        isActive: req.body.isActive,
        link_url: req.body.link_url,
      });
  
      res.status(201).json(navBarSubItem);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
// Read All NavBar SubItems
router.get('/subitems', async (req, res) => {
  try {
    const navBarSubItems = await NavBarSubItems.findAll({
        attributes: [
          'id',
          'title',
          'navBarId',
          [sequelize.literal(`CONCAT('http://localhost:5000/', displayImage)`), 'displayImage'],
          'displayIndex',
          'isActive',
          'link_url'
        ]
      });
      
    res.status(200).json(navBarSubItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read Single NavBar SubItem
router.get('/subitems/:id', async (req, res) => {
  try {
    const navBarSubItem = await NavBarSubItems.findByPk(req.params.id);
    if (!navBarSubItem) return res.status(404).json({ message: 'NavBarSubItem not found' });
    res.status(200).json(navBarSubItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update NavBar SubItem
router.put('/subitems/:id', async (req, res) => {
  try {
    const navBarSubItem = await NavBarSubItems.findByPk(req.params.id);
    if (!navBarSubItem) return res.status(404).json({ message: 'NavBarSubItem not found' });

    await navBarSubItem.update(req.body);
    res.status(200).json(navBarSubItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete NavBar SubItem
router.delete('/subitems/:id', async (req, res) => {
  try {
    const navBarSubItem = await NavBarSubItems.findByPk(req.params.id);
    if (!navBarSubItem) return res.status(404).json({ message: 'NavBarSubItem not found' });

    await navBarSubItem.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Read All NavBar Items
router.get('/itemswithSubItem', async (req, res) => {
  try {
    const navBarItems = await NavBarItem.findAll({
      include: [
        { 
          model: NavBarSubItems,
          attributes: [
            'id',
            'title',
            'navBarId',
            [sequelize.literal(`CONCAT('http://localhost:5000/', NavBarSubItems.displayImage)`), 'displayImage'],
            [sequelize.literal(`NavBarSubItems.displayIndex`), 'displayIndex'], // Using NavBarSubItems.displayIndex
            'isActive',
            'link_url'
          ]
        },
        {
          model: NavBarItem, // Include parent NavBarItem data
          attributes: ['id', 'title', 'produtCatrgory', 'produtsubCatrgory', 'displayImage', 'displayIndex', 'isActive', 'link_url']
        }
      ]
    });
    
    res.status(200).json(navBarItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
