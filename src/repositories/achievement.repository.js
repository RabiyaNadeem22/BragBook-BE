import { prisma } from '../config/prisma.js';

const achievementInclude = {
  project: {
    select: { id: true, name: true },
  },
  tags: {
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  },
  evidence: {
    orderBy: { createdAt: 'asc' },
  },
};

export const achievementRepository = {
  async findByUserId(userId, { category, projectId, search } = {}) {
    return prisma.achievement.findMany({
      where: {
        userId,
        ...(category ? { category } : {}),
        ...(projectId ? { projectId } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { impact: { contains: search, mode: 'insensitive' } },
                { metrics: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: achievementInclude,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    });
  },

  async findByIdAndUserId(id, userId) {
    return prisma.achievement.findFirst({
      where: { id, userId },
      include: achievementInclude,
    });
  },

  async create(data) {
    return prisma.achievement.create({
      data,
      include: achievementInclude,
    });
  },

  async update(id, data) {
    return prisma.achievement.update({
      where: { id },
      data,
      include: achievementInclude,
    });
  },

  async delete(id) {
    return prisma.achievement.delete({
      where: { id },
    });
  },

  async upsertTags(userId, names) {
    const uniqueNames = [...new Set(names.map((name) => name.trim()).filter(Boolean))];
    const tags = [];

    for (const name of uniqueNames) {
      const tag = await prisma.tag.upsert({
        where: { userId_name: { userId, name } },
        update: {},
        create: { userId, name },
      });
      tags.push(tag);
    }

    return tags;
  },
};
