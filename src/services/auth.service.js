import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/user.repository.js';
import { generateToken } from '../utils/token.js';
import { AppError } from '../utils/appError.js';

const SALT_ROUNDS = 12;

export const authService = {
  /**
   * Register a new user
   * @param {object} input
   */
  async register({ name, email, password, jobTitle, company }) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('An account with this email address already exists.', 409);
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await userRepository.create({
      name,
      email,
      passwordHash,
      jobTitle: jobTitle || null,
      company: company || null,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=6366f1,818cf8,4f46e5`,
    });

    const token = generateToken(newUser);

    return { user: newUser, token };
  },

  /**
   * Authenticate an existing user
   * @param {object} input
   */
  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password.', 401);
    }

    const { passwordHash: _, ...safeUser } = user;
    const token = generateToken(safeUser);

    return { user: safeUser, token };
  },

  /**
   * Get user profile by ID
   * @param {string} userId
   */
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }
    return user;
  },

  /**
   * Update authenticated user's profile
   * @param {string} userId
   * @param {object} input
   */
  async updateProfile(userId, { name, jobTitle, company, bio, avatar }) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const data = {
      name,
      jobTitle,
      company,
      bio,
    };

    if (avatar !== undefined) {
      data.avatar = avatar;
    }

    return userRepository.update(userId, data);
  },

  /**
   * Change authenticated user's password
   * @param {string} userId
   * @param {object} input
   */
  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await userRepository.findByIdWithPassword(userId);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const isCurrentValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      throw new AppError('Current password is incorrect.', 400);
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSamePassword) {
      throw new AppError('New password must be different from your current password.', 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await userRepository.updatePasswordHash(userId, passwordHash);

    return { success: true };
  },
};
