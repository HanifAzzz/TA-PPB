const express = require('express');
const router = express.Router();
const {
  getAllBuilds,
  getBuildById,
  createBuild,
  updateBuild,
  deleteBuild
} = require('../controllers/buildController');

router.get('/', getAllBuilds);
router.get('/:id', getBuildById);
router.post('/', createBuild);
router.put('/:id', updateBuild);
router.delete('/:id', deleteBuild);

module.exports = router;
