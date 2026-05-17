import type { StatKey } from '../types/pokemon'

export const statOrder: StatKey[] = ['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed']

export const statLabels: Record<StatKey, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  specialAttack: 'Sp. Attack',
  specialDefense: 'Sp. Defense',
  speed: 'Speed'
}
