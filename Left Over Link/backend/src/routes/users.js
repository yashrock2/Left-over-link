import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = express.Router();

// GET /api/users/me — auth required → user profile.
router.get('/me', protect, async (req, res) => {
  // req.user is attached by the 'protect' middleware
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, phone: true, role: true, reputation: true }
  });
  res.status(200).json({ user });
});

// PUT /api/users/me — update profile.
router.put('/me', protect, async (req, res) => {
  const { name } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { name }, // Only allowing name updates for this example
    select: { id: true, name: true, email: true, phone: true, role: true, reputation: true }
  });
  res.status(200).json({ user });
});

export default router;