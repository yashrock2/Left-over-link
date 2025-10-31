import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { otpService } from '../services/otpService.js';
// import { sendVerificationEmail } from '../services/emailService.js'; // Assumed
import crypto from 'crypto';

const prisma = new PrismaClient();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Helper to set the token (cookie for prod, JSON for dev)
const sendTokenResponse = (res, user, statusCode) => {
  const token = generateToken(user.id);

  // Production: Use httpOnly cookie
  if (process.env.NODE_ENV === 'production') {
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // Only send over HTTPS
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(statusCode).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      // Dev Note: For prod, don't send the token in the body.
      // But for dev-flow (localStorage), we must.
      token: token,
    });
  } else {
    // Development: Send token in body for localStorage
    res.status(statusCode).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }
};


// POST /api/auth/signup
export const signup = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  if (!name || !email || !password || !phone || !role) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  if (role === 'NGO' && !req.file) {
    return res.status(400).json({ error: 'NGOs must upload a registration document.' });
  }

  try {
    // Check if user exists
    const userExists = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });
    if (userExists) {
      return res.status(400).json({ error: 'User with this email or phone already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create email verification token
    const emailVerifyToken = crypto.randomBytes(32).toString('hex');

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone,
        role,
        registrationDocUrl: req.file ? `/uploads/${req.file.filename}` : null,
        emailVerifyToken,
      },
    });

    // TODO: Send verification email
    // await sendVerificationEmail(newUser.email, emailVerifyToken);
    console.log(`==== MOCK EMAIL for ${email}: Verify Token: ${emailVerifyToken} ====`);

    // Don't log in user automatically, require email verification
    res.status(201).json({
      success: true,
      message: 'Signup successful. Please check your email (or console) to verify your account.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during signup.' });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    if (!user.emailVerified) {
      return res.status(403).json({ error: 'Please verify your email before logging in.' });
    }

    sendTokenResponse(res, user, 200);

  } catch (error) {
    res.status(500).json({ error: 'Server error during login.' });
  }
};

// POST /api/auth/verify-email
export const verifyEmail = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Verification token is required.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { emailVerifyToken: token },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token.' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifyToken: null, // Clear the token
      },
    });

    res.status(200).json({ success: true, message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error during email verification.' });
  }
};


// POST /api/auth/request-otp
export const requestOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }

  try {
    const result = await otpService.sendOtp(phone);
    if (result.success) {
      res.status(200).json({ success: true, message: result.message });
    } else {
      res.status(500).json({ error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error sending OTP.' });
  }
};

// POST /api/auth/verify-otp
export const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP are required.' });
  }

  try {
    const result = await otpService.verifyOtp(phone, otp);

    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    // OTP is valid. Find or create the user.
    let user = await prisma.user.findUnique({ where: { phone } });

    if (user) {
      // User exists, log them in.
      if (!user.phoneVerified) {
        user = await prisma.user.update({
          where: { phone },
          data: { phoneVerified: true },
        });
      }
      sendTokenResponse(res, user, 200);
    } else {
      return res.status(404).json({ error: 'No account found with this phone number. Please sign up first.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error verifying OTP.' });
  }
};

// POST /api/auth/logout
export const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};