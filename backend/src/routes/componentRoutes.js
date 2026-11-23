const express = require('express');
const router = express.Router();
const {
  getAllComponents,
  getComponentById,
  getComponentsByCategory,
  createComponent,
  updateComponent,
  deleteComponent
} = require('../controllers/componentController');

router.get('/', getAllComponents);
router.get('/category/:category', getComponentsByCategory);
router.get('/:id', getComponentById);
router.post('/', createComponent);
router.put('/:id', updateComponent);
router.delete('/:id', deleteComponent);

module.exports = router;
