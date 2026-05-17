import type { PokemonProfile, StatKey } from './pokemon'
import type { RoundResult } from './scoring'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface StatQuestion {
  stat: StatKey
  actualValue: number
  options: number[]
}

export interface RoundAnswer {
  stat: StatKey
  selectedValue: number
}

export type GameEvent =
  | { type: 'ROUND_STARTED'; payload: { pokemonId: number } }
  | { type: 'POKEMON_REQUESTED'; payload: { pokemonId: number } }
  | { type: 'POKEMON_FETCHED'; payload: { pokemon: PokemonProfile } }
  | { type: 'POKEMON_FETCH_FAILED'; payload: { pokemonId: number; message: string } }
  | { type: 'OPTIONS_GENERATED'; payload: { questions: StatQuestion[] } }
  | { type: 'STAT_ANSWERED'; payload: RoundAnswer }
  | { type: 'ROUND_COMPLETED' }
  | { type: 'SCORE_CALCULATED'; payload: { result: RoundResult } }
  | { type: 'HISTORY_PERSISTED'; payload: { resultId: string } }
  | { type: 'NEXT_ROUND_PREFETCHED'; payload: { pokemonId: number } }

