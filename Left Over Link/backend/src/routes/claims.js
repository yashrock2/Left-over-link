import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';
const router = express.Router();

// POST /api/claims — ngo only → request claim.
router.post('/', protect, checkRole(['NGO']), async (req, res) => {
  res.status(201).json({ message: 'Claim requested (placeholder)' });
});

// PATCH /api/claims/:id/confirm — restaurant only → confirm claim.
router.patch('/:id/confirm', protect, checkRole(['RESTAURANT']), async (req, res) => {
  res.status(200).json({ message: 'Claim confirmed (placeholder)' });
});

// PATCH /api/claims/:id/complete — ngo only → mark complete + proof upload
router.patch('/:id/complete', protect, checkRole(['NGO']), async (req, res) => {
  // TODO: Handle proof upload
  // Logic to award points
  res.status(200).json({ message: 'Claim completed, points awarded (placeholder)' });
});

// GET /api/points/:restaurantId — view ledger. (Putting here for simplicity)
router.get('/points/:restaurantId', protect, async (req, res) => {
    res.status(200).json({ points: [], message: 'Points ledger (placeholder)' });
});


export default router;