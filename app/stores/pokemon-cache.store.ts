import { defineStore } from 'pinia'
import type { PokemonProfile } from '../types/pokemon'

export const usePokemonCacheStore = defineStore('pokemon-cache', () => {
  const profilesById = ref<Record<number, PokemonProfile>>({})
  const requestsMade = ref(0)
  const cacheHits = ref(0)

  function get(id: number): PokemonProfile | null {
    const cached = profilesById.value[id]

    if (cached) {
      cacheHits.value += 1
      return cached
    }

    return null
  }

  function set(profile: PokemonProfile): void {
    profilesById.value[profile.id] = profile
  }

  function trackRequest(): void {
    requestsMade.value += 1
  }

  return {
    profilesById,
    requestsMade,
    cacheHits,
    get,
    set,
    trackRequest
  }
})

