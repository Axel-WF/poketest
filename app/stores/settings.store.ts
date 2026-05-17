import { defineStore } from 'pinia'
import type { Difficulty } from '../types/game'

export const useSettingsStore = defineStore('settings', () => {
  const difficulty = ref<Difficulty>('medium')
  const selectedGenerations = ref<number[]>([1])
  const reducedMotion = ref(false)
  const theme = ref<'light' | 'dark' | 'system'>('system')

  return {
    difficulty,
    selectedGenerations,
    reducedMotion,
    theme
  }
})

