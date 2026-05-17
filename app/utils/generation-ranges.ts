export interface GenerationRange {
  label: string
  minId: number
  maxId: number
}

export const generationRanges: Record<number, GenerationRange> = {
  1: { label: 'Generation 1', minId: 1, maxId: 151 },
  2: { label: 'Generation 2', minId: 152, maxId: 251 },
  3: { label: 'Generation 3', minId: 252, maxId: 386 },
  4: { label: 'Generation 4', minId: 387, maxId: 493 },
  5: { label: 'Generation 5', minId: 494, maxId: 649 },
  6: { label: 'Generation 6', minId: 650, maxId: 721 },
  7: { label: 'Generation 7', minId: 722, maxId: 809 },
  8: { label: 'Generation 8', minId: 810, maxId: 905 },
  9: { label: 'Generation 9', minId: 906, maxId: 1025 }
}

