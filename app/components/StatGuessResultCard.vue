<script setup lang="ts">
import { scoreLabelClasses } from '../constants/score-styles'
import { statLabels } from '../constants/stats'
import type { StatGuessResult } from '../types/scoring'
import { formatPercent } from '../utils/formatting'

defineProps<{
  guess: StatGuessResult
}>()
</script>

<template>
  <article class="rounded-md border-2 border-[#17130f] bg-[#fffaf0] p-4">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div class="flex flex-wrap items-center gap-2">
          <h3 class="text-xl font-black">{{ statLabels[guess.stat] }}</h3>
          <span class="rounded-full px-3 py-1 text-xs font-black uppercase" :class="scoreLabelClasses[guess.label]">
            {{ guess.label }}
          </span>
        </div>
        <p class="mt-2 text-sm font-bold text-[#6f6252]">
          You guessed {{ guess.selectedValue }}. Actual value was {{ guess.actualValue }}.
        </p>
      </div>

      <div class="grid grid-cols-3 gap-2 text-center md:min-w-72">
        <div class="rounded-md border-2 border-[#17130f] bg-[#ffcf33] px-3 py-2">
          <p class="text-xs font-black uppercase text-[#6f6252]">Guess</p>
          <p class="text-2xl font-black">{{ guess.selectedValue }}</p>
        </div>
        <div class="rounded-md border-2 border-[#17130f] bg-white px-3 py-2">
          <p class="text-xs font-black uppercase text-[#6f6252]">Actual</p>
          <p class="text-2xl font-black">{{ guess.actualValue }}</p>
        </div>
        <div class="rounded-md border-2 border-[#17130f] bg-[#17130f] px-3 py-2 text-white">
          <p class="text-xs font-black uppercase text-[#ffcf33]">Points</p>
          <p class="text-2xl font-black">{{ guess.points }}</p>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <div class="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-wide text-[#6f6252]">
        <span>Deviation {{ guess.absoluteDeviation }}</span>
        <span>{{ formatPercent(guess.percentageDeviation) }}</span>
      </div>
      <div class="h-3 overflow-hidden rounded-full border-2 border-[#17130f] bg-white">
        <div
          class="h-full bg-[#c7352e]"
          :style="{ width: `${Math.min(100, Math.round(guess.percentageDeviation * 100))}%` }"
        />
      </div>
    </div>
  </article>
</template>
