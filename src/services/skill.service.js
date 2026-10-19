import { skillRepository } from '../repositories/skill.repository.js';
import { AppError } from '../utils/appError.js';

export const skillService = {
  async getUserSkills(userId, filters) {
    return skillRepository.findByUserId(userId, filters);
  },

  async getById(userId, skillId) {
    const skill = await skillRepository.findByIdAndUserId(skillId, userId);
    if (!skill) {
      throw new AppError('Skill not found.', 404);
    }
    return skill;
  },

  async createSkill(userId, input) {
    const duplicate = await skillRepository.findByNameAndUserId(userId, input.name);
    if (duplicate) {
      throw new AppError('You already have a skill with this name.', 409);
    }

    return skillRepository.create({
      userId,
      name: input.name,
      category: input.category,
      level: input.level || 'INTERMEDIATE',
      yearsOfExperience: input.yearsOfExperience ?? null,
    });
  },

  async updateSkill(userId, skillId, input) {
    await this.getById(userId, skillId);

    if (input.name) {
      const duplicate = await skillRepository.findByNameAndUserId(userId, input.name, skillId);
      if (duplicate) {
        throw new AppError('You already have a skill with this name.', 409);
      }
    }

    const data = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.category !== undefined) data.category = input.category;
    if (input.level !== undefined) data.level = input.level;
    if (input.yearsOfExperience !== undefined) data.yearsOfExperience = input.yearsOfExperience;

    return skillRepository.update(skillId, data);
  },

  async deleteSkill(userId, skillId) {
    await this.getById(userId, skillId);
    await skillRepository.delete(skillId);
    return { id: skillId };
  },
};
