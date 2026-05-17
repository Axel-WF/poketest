import type { Difficulty } from '../types/game'
import type { BaseStats } from '../types/pokemon'
import { generateStatQuestions } from '../utils/stat-options'

export function useStatOptions() {
  function createQuestions(stats: BaseStats, difficulty: Difficulty) {
    return generateStatQuestions(stats, difficulty)
  }

  return {
    createQuestions
  }
}

