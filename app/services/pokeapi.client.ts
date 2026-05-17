export interface PokeApiPokemonResponse {
  id: number
  name: string
  sprites: {
    front_default: string | null
    other?: {
      'official-artwork'?: {
        front_default: string | null
      }
    }
  }
  forms: Array<{
    name: string
    url: string
  }>
  stats: Array<{
    base_stat: number
    stat: {
      name: string
    }
  }>
  types: Array<{
    type: {
      name: string
    }
  }>
}

export async function fetchPokemonById(id: number): Promise<PokeApiPokemonResponse> {
  const config = useRuntimeConfig()
  const baseUrl = config.public.pokeapiBaseUrl || 'https://pokeapi.co/api/v2'

  return await $fetch<PokeApiPokemonResponse>(`${baseUrl}/pokemon/${id}`)
}
