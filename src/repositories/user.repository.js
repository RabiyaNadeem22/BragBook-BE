import { prisma } from '../config/prisma.js';

export const userRepository = {
  /**
   * Find a user by email address
   * @param {string} email
   */
  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  },

  /**
   * Find a user by ID (excludes passwordHash)
   * @param {string} id
   */
  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        jobTitle: true,
        company: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  /**
   * Find a user by ID including password hash (for password changes)
   * @param {string} id
   */
  async findByIdWithPassword(id) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  /**
   * Create a new user
   * @param {object} userData
   */
  async create(userData) {
    return prisma.user.create({
      data: {
        ...userData,
        email: userData.email.toLowerCase(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        jobTitle: true,
        company: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  /**
   * Update profile fields for a user
   * @param {string} id
   * @param {object} data
   */
  async update(id, data) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        jobTitle: true,
        company: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  /**
   * Replace a user's password hash
   * @param {string} id
   * @param {string} passwordHash
   */
  async updatePasswordHash(id, passwordHash) {
    await prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  },
};
