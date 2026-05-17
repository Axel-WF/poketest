<script setup lang="ts">
import { statOrder } from '../constants/stats'
import type { RoundResult } from '../types/scoring'
import { formatPercent } from '../utils/formatting'

const game = useGameStore()
const history = useHistoryStore()

const result = computed<RoundResult | null>(() => game.currentResult ?? history.rounds.at(-1) ?? null)
const orderedGuesses = computed(() => {
  if (!result.value) return []

  return [...result.value.guesses].sort((left, right) => statOrder.indexOf(left.stat) - statOrder.indexOf(right.stat))
})

const scorePercent = computed(() => {
  if (!result.value || result.value.maxScore === 0) return 0
  return Math.round((result.value.totalScore / result.value.maxScore) * 100)
})
</script>

<template>
  <main class="min-h-screen bg-[#f7f3ea] px-4 py-6 text-[#17130f] sm:px-6 lg:px-10">
    <section v-if="result" class="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[360px_1fr]">
      <aside class="rounded-lg border-2 border-[#17130f] bg-[#fffaf0] p-5 shadow-[8px_8px_0_#17130f]">
        <p class="text-xs font-black uppercase tracking-[0.24em] text-[#c7352e]">Round result</p>
        <h1 class="mt-2 text-4xl font-black tracking-tight">{{ scorePercent }}%</h1>
        <p class="mt-2 text-sm font-bold text-[#6f6252]">
          {{ result.totalScore }} of {{ result.maxScore }} points
        </p>

        <PokemonSummaryCard
          class="mt-6"
          :pokemon="result.pokemon"
          secondary-label="Accuracy"
          :secondary-value="formatPercent(result.accuracy)"
        />

        <div class="mt-5 grid grid-cols-2 gap-3">
          <div class="rounded-md border-2 border-[#17130f] bg-[#17130f] p-4 text-white">
            <p class="text-xs font-black uppercase tracking-wide text-[#ffcf33]">Avg miss</p>
            <p class="mt-1 text-3xl font-black">{{ result.averageAbsoluteDeviation.toFixed(1) }}</p>
          </div>
          <div class="rounded-md border-2 border-[#17130f] bg-white p-4">
            <p class="text-xs font-black uppercase tracking-wide text-[#6f6252]">Base total</p>
            <p class="mt-1 text-3xl font-black">{{ result.pokemon.totalBaseStats }}</p>
          </div>
        </div>

        <NuxtLink
          to="/play"
          class="mt-5 block rounded-md border-2 border-[#17130f] bg-[#ffcf33] px-4 py-3 text-center text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_#17130f] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#ffcf33]/40"
        >
          Next round
        </NuxtLink>
        <NuxtLink
          to="/"
          class="mt-3 block rounded-md border-2 border-[#17130f] bg-white px-4 py-3 text-center text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_#17130f] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#ffcf33]/40"
        >
          Main menu
        </NuxtLink>
      </aside>

      <section class="rounded-lg border-2 border-[#17130f] bg-white p-4 shadow-[8px_8px_0_#17130f] sm:p-6">
        <div class="flex flex-col justify-between gap-4 border-b-2 border-[#17130f] pb-5 sm:flex-row sm:items-end">
          <div>
            <p class="text-xs font-black uppercase tracking-[0.24em] text-[#c7352e]">Revealed stats</p>
            <h2 class="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Guess vs actual</h2>
          </div>
          <p class="max-w-md text-sm font-semibold leading-6 text-[#6f6252]">
            Exact guesses score 100. The closest wrong option earns 50. The farthest wrong option earns 0.
          </p>
        </div>

        <div class="grid gap-4 pt-6">
          <StatGuessResultCard
            v-for="guess in orderedGuesses"
            :key="guess.stat"
            :guess="guess"
          />
        </div>
      </section>
    </section>

    <section v-else class="mx-auto grid min-h-[70vh] max-w-3xl place-items-center">
      <div class="rounded-lg border-2 border-[#17130f] bg-white p-8 text-center shadow-[8px_8px_0_#17130f]">
        <p class="text-xs font-black uppercase tracking-[0.24em] text-[#c7352e]">No result yet</p>
        <h1 class="mt-3 text-4xl font-black">Finish a round first</h1>
        <p class="mt-3 text-sm font-bold leading-6 text-[#6f6252]">
          Results are generated after you lock guesses for all six stats.
        </p>
        <NuxtLink
          to="/play"
          class="mt-6 inline-block rounded-md border-2 border-[#17130f] bg-[#ffcf33] px-5 py-3 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_#17130f]"
        >
          Start round
        </NuxtLink>
        <NuxtLink
          to="/"
          class="ml-0 mt-3 inline-block rounded-md border-2 border-[#17130f] bg-white px-5 py-3 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_#17130f] sm:ml-3"
        >
          Main menu
        </NuxtLink>
      </div>
    </section>
  </main>
</template>
