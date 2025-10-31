import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = express.Router();

// Protect all admin routes
router.use(protect, checkRole(['ADMIN']));

// GET /api/admin/pending-ngos — admin only.
router.get('/pending-ngos', async (req, res) => {
  // Find NGOs who have a doc URL but are not yet verified
  // This is a simplified logic. In a real app, you'd have a `status` field.
  // For this schema, we'll find users with a doc URL whose email IS verified (they signed up)
  // but their 'reputation' is 0 (our marker for 'not approved').
  const pendingNgos = await prisma.user.findMany({
    where: {
      role: 'NGO',
      registrationDocUrl: { not: null },
      reputation: 0 // Using reputation=0 as 'pending'
    }
  });
  res.status(200).json(pendingNgos);
});

// PATCH /api/admin/verify-ngo/:id — admin only.
router.patch('/verify-ngo/:id', async (req, res) => {
  const { id } = req.params;
  const ngo = await prisma.user.update({
    where: { id: id, role: 'NGO' },
    data: {
      reputation: 1, // Set reputation to 1 to mark as verified
      // In a real app, you'd flip a `verified` boolean
    }
  });
  res.status(200).json(ngo);
});

export default router;