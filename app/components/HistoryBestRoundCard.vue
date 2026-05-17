<script setup lang="ts">
import type { RoundResult } from '../types/scoring'
import { formatPercent } from '../utils/formatting'

defineProps<{
  round: RoundResult
}>()
</script>

<template>
  <article class="rounded-lg border-2 border-[#17130f] bg-white p-5 shadow-[6px_6px_0_#17130f]">
    <p class="text-xs font-black uppercase tracking-[0.2em] text-[#c7352e]">Best run</p>
    <div class="mt-4 grid place-items-center rounded-md bg-[#e9f2ff] p-4">
      <img
        v-if="round.pokemon.spriteUrl"
        :src="round.pokemon.spriteUrl"
        :alt="round.pokemon.name"
        class="h-36 w-36 object-contain drop-shadow-xl"
      >
      <div v-else class="grid h-36 w-36 place-items-center rounded-full bg-[#d8cfbd] text-sm font-bold">
        No sprite
      </div>
    </div>
    <p class="mt-4 text-3xl font-black">{{ round.pokemon.name }}</p>
    <p class="mt-1 text-sm font-bold text-[#6f6252]">
      #{{ round.pokemon.id }} / {{ round.totalScore }} / {{ round.maxScore }} points
    </p>
    <div class="mt-4 h-4 overflow-hidden rounded-full border-2 border-[#17130f] bg-[#fffaf0]">
      <div class="h-full bg-[#ffcf33]" :style="{ width: formatPercent(round.accuracy) }" />
    </div>
  </article>
</template>
