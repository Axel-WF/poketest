import { defineStore } from 'pinia'
import type { GameEvent, RoundAnswer, StatQuestion } from '../types/game'
import type { PokemonProfile } from '../types/pokemon'
import type { RoundResult } from '../types/scoring'

export const useGameStore = defineStore('game', () => {
  const events = ref<GameEvent[]>([])
  const currentPokemon = ref<PokemonProfile | null>(null)
  const questions = ref<StatQuestion[]>([])
  const answers = ref<RoundAnswer[]>([])
  const currentResult = ref<RoundResult | null>(null)

  const answeredStatsCount = computed(() => answers.value.length)
  const isRoundComplete = computed(() => questions.value.length > 0 && answers.value.length === questions.value.length)

  function recordEvent(event: GameEvent): void {
    events.value.push(event)
  }

  function answerStat(answer: RoundAnswer): void {
    answers.value = [...answers.value.filter((item) => item.stat !== answer.stat), answer]
    recordEvent({ type: 'STAT_ANSWERED', payload: answer })
  }

  function resetRound(): void {
    currentPokemon.value = null
    questions.value = []
    answers.value = []
    currentResult.value = null
  }

  return {
    events,
    currentPokemon,
    questions,
    answers,
    currentResult,
    answeredStatsCount,
    isRoundComplete,
    recordEvent,
    answerStat,
    resetRound
  }
})
