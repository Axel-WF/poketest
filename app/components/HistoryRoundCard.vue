<script setup lang="ts">
import { scoreSwatchClasses } from '../constants/score-styles'
import type { RoundResult } from '../types/scoring'
import { formatPercent, formatRoundDate } from '../utils/formatting'

defineProps<{
  round: RoundResult
}>()

const emit = defineEmits<{
  remove: [roundId: string]
}>()
</script>

<template>
  <article class="rounded-md border-2 border-[#17130f] bg-[#fffaf0] p-4">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex min-w-0 items-center gap-4">
        <div class="grid h-20 w-20 shrink-0 place-items-center rounded-md border-2 border-[#17130f] bg-[#e9f2ff]">
          <img
            v-if="round.pokemon.spriteUrl"
            :src="round.pokemon.spriteUrl"
            :alt="round.pokemon.name"
            class="h-16 w-16 object-contain"
          >
          <span v-else class="text-xs font-black">No sprite</span>
        </div>
        <div class="min-w-0">
          <p class="truncate text-2xl font-black">{{ round.pokemon.name }}</p>
          <p class="mt-1 text-sm font-bold text-[#6f6252]">
            #{{ round.pokemon.id }} / {{ formatRoundDate(round.completedAt) }}
          </p>
          <div class="mt-2 flex flex-wrap gap-1">
            <span
              v-for="type in round.pokemon.types"
              :key="type"
              class="rounded-full border-2 border-[#17130f] bg-white px-2 py-0.5 text-[10px] font-black uppercase"
            >
              {{ type }}
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-[1fr_auto] items-center gap-3 sm:min-w-72">
        <div>
          <div class="flex items-center justify-between text-xs font-black uppercase tracking-wide text-[#6f6252]">
            <span>{{ round.totalScore }} / {{ round.maxScore }}</span>
            <span>{{ formatPercent(round.accuracy) }}</span>
          </div>
          <div class="mt-2 h-3 overflow-hidden rounded-full border-2 border-[#17130f] bg-white">
            <div class="h-full bg-[#ffcf33]" :style="{ width: formatPercent(round.accuracy) }" />
          </div>
          <div class="mt-3 grid grid-cols-6 gap-1">
            <span
              v-for="guess in round.guesses"
              :key="`${round.id}-${guess.stat}`"
              class="h-5 rounded border-2 border-[#17130f]"
              :class="scoreSwatchClasses[guess.label]"
              :title="`${guess.stat}: ${guess.points} points`"
            />
          </div>
        </div>
        <button
          type="button"
          class="rounded-md border-2 border-[#17130f] bg-white px-3 py-2 text-xs font-black uppercase shadow-[3px_3px_0_#17130f] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#ffcf33]/40"
          @click="emit('remove', round.id)"
        >
          Delete
        </button>
      </div>
    </div>
  </article>
</template>
