import { defineStore } from 'pinia'
import type { RoundResult } from '../types/scoring'

const historyStorageKey = 'pokestatdle:round-history'
const maxStoredRounds = 10

export const useHistoryStore = defineStore('history', () => {
  const rounds = ref<RoundResult[]>([])

  if (import.meta.client) {
    const storedHistory = window.localStorage.getItem(historyStorageKey)

    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory)

        if (Array.isArray(parsedHistory)) {
          rounds.value = (parsedHistory as RoundResult[]).slice(-maxStoredRounds)
        }
      } catch {
        window.localStorage.removeItem(historyStorageKey)
      }
    }

    watch(
      rounds,
      (nextRounds) => {
        window.localStorage.setItem(historyStorageKey, JSON.stringify(nextRounds))
      },
      { deep: true }
    )
  }

  const totalRounds = computed(() => rounds.value.length)
  const recentAverageScore = computed(() => {
    const recent = rounds.value.slice(-10)
    if (recent.length === 0) return 0

    return recent.reduce((sum, round) => sum + round.totalScore, 0) / recent.length
  })

  function addRound(result: RoundResult): void {
    rounds.value.push(result)

    if (rounds.value.length > maxStoredRounds) {
      rounds.value = rounds.value.slice(-maxStoredRounds)
    }
  }

  function removeRound(roundId: string): void {
    rounds.value = rounds.value.filter((round) => round.id !== roundId)
  }

  function clearHistory(): void {
    rounds.value = []
  }

  return {
    rounds,
    totalRounds,
    recentAverageScore,
    addRound,
    removeRound,
    clearHistory
  }
})
