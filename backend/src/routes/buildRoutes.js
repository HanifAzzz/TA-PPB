const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  getAllBuilds,
  getBuildById,
  createBuild,
  updateBuild,
  deleteBuild
} = require('../controllers/buildController');

// All build operations require user authentication
router.use(requireAuth);

router.get('/', getAllBuilds);
router.get('/:id', getBuildById);
router.post('/', createBuild);
router.put('/:id', updateBuild);
router.delete('/:id', deleteBuild);

module.exports = router;
