import type { RoundAnswer, StatQuestion } from '../types/game'
import type { PokemonProfile } from '../types/pokemon'
import type { RoundResult, StatGuessResult } from '../types/scoring'

const maxPointsPerStat = 100

export function scoreRound(pokemon: PokemonProfile, answers: RoundAnswer[], questions: StatQuestion[]): RoundResult {
  const guesses = answers.map((answer): StatGuessResult => {
    const actualValue = pokemon.stats[answer.stat]
    const absoluteDeviation = Math.abs(answer.selectedValue - actualValue)
    const percentageDeviation = actualValue === 0 ? 0 : absoluteDeviation / actualValue
    const question = questions.find((item) => item.stat === answer.stat)
    const points = scoreGuess(actualValue, answer.selectedValue, question?.options ?? [actualValue, answer.selectedValue])

    return {
      stat: answer.stat,
      actualValue,
      selectedValue: answer.selectedValue,
      absoluteDeviation,
      percentageDeviation,
      points,
      label: scoreLabel(points)
    }
  })

  const totalScore = guesses.reduce((sum, guess) => sum + guess.points, 0)
  const maxScore = guesses.length * maxPointsPerStat
  const averageAbsoluteDeviation =
    guesses.length === 0 ? 0 : guesses.reduce((sum, guess) => sum + guess.absoluteDeviation, 0) / guesses.length
  const averagePercentageDeviation =
    guesses.length === 0 ? 0 : guesses.reduce((sum, guess) => sum + guess.percentageDeviation, 0) / guesses.length

  return {
    id: crypto.randomUUID(),
    pokemon,
    guesses,
    totalScore,
    maxScore,
    accuracy: maxScore === 0 ? 0 : totalScore / maxScore,
    averageAbsoluteDeviation,
    averagePercentageDeviation,
    averageDeviation: averageAbsoluteDeviation,
    completedAt: new Date().toISOString()
  }
}

export function scoreGuess(actualValue: number, selectedValue: number, options: number[]): number {
  if (selectedValue === actualValue) return 100

  const wrongOptionDeviations = options
    .filter((option) => option !== actualValue)
    .map((option) => Math.abs(option - actualValue))

  if (wrongOptionDeviations.length === 0) return 0

  const selectedDeviation = Math.abs(selectedValue - actualValue)
  const closestWrongDeviation = Math.min(...wrongOptionDeviations)

  if (selectedDeviation === closestWrongDeviation) return 50
  return 0
}

export function scoreLabel(points: number): StatGuessResult['label'] {
  if (points === 100) return 'exact'
  if (points === 50) return 'near'
  return 'miss'
}
