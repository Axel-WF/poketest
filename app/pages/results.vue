<script setup lang="ts">
import type { StatKey } from '../types/pokemon'
import type { RoundResult, StatGuessResult } from '../types/scoring'

const game = useGameStore()
const history = useHistoryStore()

const statOrder: StatKey[] = ['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed']
const statLabels: Record<StatKey, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  specialAttack: 'Sp. Attack',
  specialDefense: 'Sp. Defense',
  speed: 'Speed'
}

const result = computed<RoundResult | null>(() => game.currentResult ?? history.rounds.at(-1) ?? null)
const orderedGuesses = computed(() => {
  if (!result.value) return []

  return [...result.value.guesses].sort((left, right) => statOrder.indexOf(left.stat) - statOrder.indexOf(right.stat))
})

const scorePercent = computed(() => {
  if (!result.value || result.value.maxScore === 0) return 0
  return Math.round((result.value.totalScore / result.value.maxScore) * 100)
})

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

function labelClass(label: StatGuessResult['label']): string {
  const classes: Record<StatGuessResult['label'], string> = {
    exact: 'border-2 border-[#17130f] bg-[#ffcf33] text-[#17130f]',
    near: 'border-2 border-[#17130f] bg-[#efe4d0] text-[#17130f]',
    miss: 'border-2 border-[#17130f] bg-[#c7352e] text-white'
  }

  return classes[label]
}
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

        <div class="mt-6 rounded-md border-2 border-[#17130f] bg-white p-4">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-xs font-black uppercase tracking-[0.18em] text-[#6f6252]">Pokemon ID</p>
              <p class="text-2xl font-black">#{{ result.pokemon.id }}</p>
            </div>
            <div class="rounded-md bg-[#ffcf33] px-3 py-2 text-sm font-black uppercase">
              {{ formatPercent(result.accuracy) }}
            </div>
          </div>

          <div class="mt-4 grid place-items-center rounded-md bg-[#e9f2ff] p-4">
            <img
              v-if="result.pokemon.spriteUrl"
              :src="result.pokemon.spriteUrl"
              :alt="result.pokemon.name"
              class="h-44 w-44 object-contain drop-shadow-xl"
            >
            <div v-else class="grid h-44 w-44 place-items-center rounded-full bg-[#d8cfbd] text-sm font-bold">
              No sprite
            </div>
          </div>

          <h2 class="mt-4 text-3xl font-black">{{ result.pokemon.name }}</h2>
          <p v-if="result.pokemon.formName" class="mt-1 text-sm font-bold text-[#6f6252]">
            Form: {{ result.pokemon.formName }}
          </p>

          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="type in result.pokemon.types"
              :key="type"
              class="rounded-full border-2 border-[#17130f] bg-[#ffcf33] px-3 py-1 text-xs font-black uppercase"
            >
              {{ type }}
            </span>
          </div>
        </div>

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
          <article
            v-for="guess in orderedGuesses"
            :key="guess.stat"
            class="rounded-md border-2 border-[#17130f] bg-[#fffaf0] p-4"
          >
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="text-xl font-black">{{ statLabels[guess.stat] }}</h3>
                  <span
                    class="rounded-full px-3 py-1 text-xs font-black uppercase"
                    :class="labelClass(guess.label)"
                  >
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
