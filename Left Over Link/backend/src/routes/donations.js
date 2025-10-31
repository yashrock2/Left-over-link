import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = express.Router();

// POST /api/donations — restaurant only → create donation.
router.post('/', protect, checkRole(['RESTAURANT']), async (req, res) => {
  // Logic to create a donation
  res.status(201).json({ message: 'Donation created (placeholder)' });
});

// GET /api/donations — list/filter donations
router.get('/', protect, async (req, res) => {
  // Logic to get all AVAILABLE donations
  const donations = await prisma.donation.findMany({
    where: { status: 'AVAILABLE' },
    include: { restaurant: { select: { name: true } } } // Include restaurant name
  });
  res.status(200).json(donations);
});

export default router;