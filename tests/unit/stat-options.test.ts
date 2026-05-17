import { afterEach, describe, expect, it, vi } from 'vitest'
import { generateStatOptions, generateStatQuestions } from '../../app/utils/stat-options'
import type { BaseStats } from '../../app/types/pokemon'

const stats: BaseStats = {
  hp: 45,
  attack: 49,
  defense: 49,
  specialAttack: 65,
  specialDefense: 65,
  speed: 45
}

describe('generateStatQuestions', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates one question per base stat', () => {
    expect(generateStatQuestions(stats, 'medium')).toHaveLength(6)
  })

  it('includes the actual value and three unique options', () => {
    for (const question of generateStatQuestions(stats, 'medium')) {
      expect(question.options).toContain(question.actualValue)
      expect(new Set(question.options).size).toBe(3)
    }
  })

  it('uses wider percentage deltas for easy mode than hard mode', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.7)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.7)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)

    const easyOptions = generateStatOptions(100, 'easy')
    const hardOptions = generateStatOptions(100, 'hard')

    expect(easyOptions).toEqual(expect.arrayContaining([82, 100, 118]))
    expect(hardOptions).toEqual(expect.arrayContaining([96, 100, 104]))
  })

  it('scales generated wrong options with the actual stat value', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.7)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.7)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)

    const lowStatOptions = generateStatOptions(30, 'medium')
    const highStatOptions = generateStatOptions(150, 'medium')

    expect(lowStatOptions).toEqual(expect.arrayContaining([27, 30, 33]))
    expect(highStatOptions).toEqual(expect.arrayContaining([135, 150, 165]))
  })

  it('can generate both distractors below the actual value', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(0)

    const options = generateStatOptions(100, 'medium')

    expect(options).toEqual(expect.arrayContaining([78, 90, 100]))
  })

  it('can generate both distractors above the actual value', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(0)

    const options = generateStatOptions(100, 'medium')

    expect(options).toEqual(expect.arrayContaining([100, 110, 122]))
  })

  it('keeps options unique after rounding and clamping', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.7)

    const options = generateStatOptions(1, 'hard')

    expect(options).toContain(1)
    expect(new Set(options).size).toBe(3)
    expect(options.every((option) => option >= 1 && option <= 255)).toBe(true)
  })
})
