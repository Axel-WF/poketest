import type { Difficulty, StatQuestion } from '../types/game'
import type { BaseStats, StatKey } from '../types/pokemon'
import { clamp } from './clamp'
import { randomFloat } from './random'
import { shuffle } from './shuffle'

const statKeys: StatKey[] = ['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed']

export const difficultyDeltaPercentRanges: Record<Difficulty, readonly [number, number]> = {
  easy: [0.18, 0.35],
  medium: [0.1, 0.22],
  hard: [0.04, 0.12]
} as const

const minStatValue = 1
const maxStatValue = 255

export function generateStatQuestions(stats: BaseStats, difficulty: Difficulty): StatQuestion[] {
  return statKeys.map((stat) => {
    const actualValue = stats[stat]

    return {
      stat,
      actualValue,
      options: generateStatOptions(actualValue, difficulty)
    }
  })
}

export function generateStatOptions(actualValue: number, difficulty: Difficulty): number[] {
  const [minPercent, maxPercent] = difficultyDeltaPercentRanges[difficulty]
  const [firstDirection, secondDirection] = pickDistractorDirections()
  const firstWrongOption = makeWrongOption(actualValue, firstDirection, minPercent, maxPercent)
  const secondWrongOption = makeWrongOption(actualValue, secondDirection, minPercent, maxPercent)

  return shuffle(uniqueWithFallback([actualValue, firstWrongOption, secondWrongOption], actualValue))
}

function makeWrongOption(actualValue: number, direction: -1 | 1, minPercent: number, maxPercent: number): number {
  const percent = randomFloat(minPercent, maxPercent)
  const delta = Math.max(1, Math.round(actualValue * percent))

  return clamp(actualValue + direction * delta, minStatValue, maxStatValue)
}

function pickDistractorDirections(): readonly [-1 | 1, -1 | 1] {
  const roll = Math.random()

  if (roll < 0.3) return [-1, -1]
  if (roll < 0.6) return [1, 1]
  return [-1, 1]
}

function uniqueWithFallback(options: number[], actualValue: number): number[] {
  const values = new Set(options)
  let offset = 1

  while (values.size < 3) {
    values.add(clamp(actualValue + offset, minStatValue, maxStatValue))
    values.add(clamp(actualValue - offset, minStatValue, maxStatValue))
    offset += 1
  }

  return [...values].slice(0, 3)
}
