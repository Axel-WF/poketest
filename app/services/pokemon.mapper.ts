import type { PokemonProfile, PokemonType, StatKey } from '../types/pokemon'
import type { PokeApiPokemonResponse } from './pokeapi.client'

const statNameMap: Record<string, StatKey> = {
  hp: 'hp',
  attack: 'attack',
  defense: 'defense',
  'special-attack': 'specialAttack',
  'special-defense': 'specialDefense',
  speed: 'speed'
}

const knownTypes = new Set<PokemonType>([
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy'
])

export function mapPokemonResponse(response: PokeApiPokemonResponse): PokemonProfile {
  const stats = {
    hp: 0,
    attack: 0,
    defense: 0,
    specialAttack: 0,
    specialDefense: 0,
    speed: 0
  }

  for (const item of response.stats) {
    const key = statNameMap[item.stat.name]
    if (key) {
      stats[key] = item.base_stat
    }
  }

  return {
    id: response.id,
    name: formatPokemonName(response.name),
    formName: mapFormName(response),
    spriteUrl: response.sprites.other?.['official-artwork']?.front_default ?? response.sprites.front_default,
    types: response.types
      .map((item) => item.type.name)
      .filter((type): type is PokemonType => knownTypes.has(type as PokemonType)),
    stats,
    totalBaseStats: Object.values(stats).reduce((sum, value) => sum + value, 0)
  }
}

function mapFormName(response: PokeApiPokemonResponse): string | null {
  const formName = response.forms[0]?.name
  if (!formName || formName === response.name) return null

  return formatPokemonName(formName)
}

function formatPokemonName(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
