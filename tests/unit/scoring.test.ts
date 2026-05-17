import { describe, expect, it } from 'vitest'
import { scoreGuess, scoreLabel, scoreRound } from '../../app/utils/scoring'
import type { RoundAnswer } from '../../app/types/game'
import type { PokemonProfile } from '../../app/types/pokemon'

describe('scoreGuess', () => {
  it('returns full points for an exact match', () => {
    expect(scoreGuess(100, 100, [88, 100, 121])).toBe(100)
  })

  it('rewards the closest wrong option', () => {
    expect(scoreGuess(100, 88, [88, 100, 121])).toBe(50)
  })

  it('returns zero for the farthest wrong option', () => {
    expect(scoreGuess(100, 121, [88, 100, 121])).toBe(0)
  })

  it('rewards tied wrong options equally', () => {
    expect(scoreGuess(100, 90, [90, 100, 110])).toBe(50)
    expect(scoreGuess(100, 110, [90, 100, 110])).toBe(50)
  })
})

describe('scoreLabel', () => {
  it('labels exact, near, and miss guesses from points', () => {
    expect(scoreLabel(100)).toBe('exact')
    expect(scoreLabel(50)).toBe('near')
    expect(scoreLabel(0)).toBe('miss')
  })
})

describe('scoreRound', () => {
  it('calculates aggregate absolute and percentage deviations', () => {
    const pokemon: PokemonProfile = {
      id: 1,
      name: 'Bulbasaur',
      formName: null,
      spriteUrl: null,
      types: ['grass', 'poison'],
      stats: {
        hp: 100,
        attack: 50,
        defense: 50,
        specialAttack: 50,
        specialDefense: 50,
        speed: 50
      },
      totalBaseStats: 350
    }
    const answers: RoundAnswer[] = [
      { stat: 'hp', selectedValue: 100 },
      { stat: 'attack', selectedValue: 45 }
    ]
    const questions = [
      { stat: 'hp' as const, actualValue: 100, options: [90, 100, 120] },
      { stat: 'attack' as const, actualValue: 50, options: [45, 50, 65] }
    ]

    const result = scoreRound(pokemon, answers, questions)

    expect(result.totalScore).toBe(150)
    expect(result.averageAbsoluteDeviation).toBe(2.5)
    expect(result.averagePercentageDeviation).toBe(0.05)
    expect(result.guesses.map((guess) => guess.label)).toEqual(['exact', 'near'])
  })
})
