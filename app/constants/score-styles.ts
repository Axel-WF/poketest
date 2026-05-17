import type { StatGuessResult } from '../types/scoring'

export const scoreLabelClasses: Record<StatGuessResult['label'], string> = {
  exact: 'border-2 border-[#17130f] bg-[#ffcf33] text-[#17130f]',
  near: 'border-2 border-[#17130f] bg-[#efe4d0] text-[#17130f]',
  miss: 'border-2 border-[#17130f] bg-[#c7352e] text-white'
}

export const scoreSwatchClasses: Record<StatGuessResult['label'], string> = {
  exact: 'bg-[#ffcf33]',
  near: 'bg-[#efe4d0]',
  miss: 'bg-[#c7352e]'
}
