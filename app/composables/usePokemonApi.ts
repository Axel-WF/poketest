import { fetchPokemonById } from '../services/pokeapi.client'
import { mapPokemonResponse } from '../services/pokemon.mapper'

export function usePokemonApi() {
  async function getPokemonProfile(id: number) {
    const response = await fetchPokemonById(id)
    return mapPokemonResponse(response)
  }

  return {
    getPokemonProfile
  }
}

