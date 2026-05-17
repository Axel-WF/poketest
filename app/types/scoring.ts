import type { PokemonProfile, StatKey } from './pokemon'

export interface StatGuessResult {
  stat: StatKey
  actualValue: number
  selectedValue: number
  absoluteDeviation: number
  percentageDeviation: number
  points: number
  label: 'exact' | 'near' | 'miss'
}

export interface RoundResult {
  id: string
  pokemon: PokemonProfile
  guesses: StatGuessResult[]
  totalScore: number
  maxScore: number
  accuracy: number
  averageAbsoluteDeviation: number
  averagePercentageDeviation: number
  averageDeviation: number
  completedAt: string
}
