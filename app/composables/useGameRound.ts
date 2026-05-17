import { generationRanges } from '../utils/generation-ranges'
import { randomInt } from '../utils/random'

export function useGameRound() {
  function pickRandomPokemonId(generations: number[]): number {
    const selectedGeneration = generations[randomInt(0, generations.length - 1)] ?? 1
    const range = generationRanges[selectedGeneration] ?? generationRanges[1]

    return randomInt(range.minId, range.maxId)
  }

  return {
    pickRandomPokemonId
  }
}

