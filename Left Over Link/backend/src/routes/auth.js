import express from 'express';
import {
  signup,
  login,
  verifyEmail,
  requestOtp,
  verifyOtp,
  logout
} from '../controllers/authController.js';
import { uploadSingle } from '../services/storageService.js';

const router = express.Router();

router.post(
  '/signup',
  uploadSingle('registrationDoc'), // 'registrationDoc' is the field name
  signup
);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/logout', logout);

export default router;