import { prisma } from '../config/prisma.js';

export const skillRepository = {
  /**
   * Find all skills for a user ordered by category and creation date
   * @param {string} userId
   * @param {{ category?: string }} [filters]
   */
  async findByUserId(userId, { category } = {}) {
    return prisma.skill.findMany({
      where: {
        userId,
        ...(category ? { category } : {}),
      },
      orderBy: [{ category: 'asc' }, { createdAt: 'desc' }],
    });
  },

  async findByNameAndUserId(userId, name, excludeId) {
    return prisma.skill.findFirst({
      where: {
        userId,
        name: { equals: name, mode: 'insensitive' },
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
  },

  /**
   * Find a specific skill by ID and userId (ensures tenant isolation)
   * @param {string} id
   * @param {string} userId
   */
  async findByIdAndUserId(id, userId) {
    return prisma.skill.findFirst({
      where: { id, userId },
    });
  },

  /**
   * Create a skill
   * @param {object} data
   */
  async create(data) {
    return prisma.skill.create({
      data,
    });
  },

  async update(id, data) {
    return prisma.skill.update({
      where: { id },
      data,
    });
  },

  /**
   * Delete a skill by ID
   * @param {string} id
   */
  async delete(id) {
    return prisma.skill.delete({
      where: { id },
    });
  },
};
