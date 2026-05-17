<script setup lang="ts">
import type { RoundResult, StatGuessResult } from '../types/scoring'

const history = useHistoryStore()

const recentRounds = computed(() => [...history.rounds].reverse())
const bestRound = computed<RoundResult | null>(() => {
  if (history.rounds.length === 0) return null

  return history.rounds.reduce((best, round) => (round.accuracy > best.accuracy ? round : best), history.rounds[0])
})
const totalExactGuesses = computed(() =>
  history.rounds.reduce(
    (sum, round) => sum + round.guesses.filter((guess) => guess.label === 'exact').length,
    0
  )
)
const averageAccuracy = computed(() => {
  if (history.rounds.length === 0) return 0

  return history.rounds.reduce((sum, round) => sum + round.accuracy, 0) / history.rounds.length
})

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

function scoreClass(label: StatGuessResult['label']): string {
  const classes: Record<StatGuessResult['label'], string> = {
    exact: 'bg-[#ffcf33]',
    near: 'bg-[#efe4d0]',
    miss: 'bg-[#c7352e]'
  }

  return classes[label]
}

function clearHistory(): void {
  if (history.totalRounds === 0) return
  if (import.meta.client && !window.confirm('Clear all local round history?')) return

  history.clearHistory()
}
</script>

<template>
  <main class="min-h-screen bg-[#f7f3ea] px-4 py-6 text-[#17130f] sm:px-6 lg:px-10">
    <section class="mx-auto max-w-7xl">
      <div class="flex flex-col justify-between gap-5 rounded-lg border-2 border-[#17130f] bg-[#fffaf0] p-6 shadow-[8px_8px_0_#17130f] sm:p-8 lg:flex-row lg:items-end">
        <div>
          <p class="text-xs font-black uppercase tracking-[0.24em] text-[#c7352e]">Local history</p>
          <h1 class="mt-3 text-5xl font-black tracking-tight sm:text-6xl">Round archive</h1>
          <p class="mt-4 max-w-2xl text-base font-semibold leading-7 text-[#6f6252]">
            Stored in this browser only. Static hosting stays simple, and your 10 latest rounds remain available between sessions.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <NuxtLink
            to="/"
            class="rounded-md border-2 border-[#17130f] bg-white px-5 py-3 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_#17130f] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#ffcf33]/40"
          >
            Main menu
          </NuxtLink>
          <NuxtLink
            to="/play"
            class="rounded-md border-2 border-[#17130f] bg-[#ffcf33] px-5 py-3 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_#17130f] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#ffcf33]/40"
          >
            New round
          </NuxtLink>
        </div>
      </div>

      <section v-if="history.totalRounds > 0" class="mt-6 grid gap-6 lg:grid-cols-[330px_1fr]">
        <aside class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-md border-2 border-[#17130f] bg-white p-4">
              <p class="text-xs font-black uppercase tracking-wide text-[#6f6252]">Rounds</p>
              <p class="mt-1 text-4xl font-black">{{ history.totalRounds }}</p>
            </div>
            <div class="rounded-md border-2 border-[#17130f] bg-[#17130f] p-4 text-white">
              <p class="text-xs font-black uppercase tracking-wide text-[#ffcf33]">Average</p>
              <p class="mt-1 text-4xl font-black">{{ formatPercent(averageAccuracy) }}</p>
            </div>
            <div class="rounded-md border-2 border-[#17130f] bg-[#ffcf33] p-4">
              <p class="text-xs font-black uppercase tracking-wide text-[#6f6252]">Best</p>
              <p class="mt-1 text-4xl font-black">{{ bestRound ? formatPercent(bestRound.accuracy) : '0%' }}</p>
            </div>
            <div class="rounded-md border-2 border-[#17130f] bg-white p-4">
              <p class="text-xs font-black uppercase tracking-wide text-[#6f6252]">Exact</p>
              <p class="mt-1 text-4xl font-black">{{ totalExactGuesses }}</p>
            </div>
          </div>

          <article
            v-if="bestRound"
            class="rounded-lg border-2 border-[#17130f] bg-white p-5 shadow-[6px_6px_0_#17130f]"
          >
            <p class="text-xs font-black uppercase tracking-[0.2em] text-[#c7352e]">Best run</p>
            <div class="mt-4 grid place-items-center rounded-md bg-[#e9f2ff] p-4">
              <img
                v-if="bestRound.pokemon.spriteUrl"
                :src="bestRound.pokemon.spriteUrl"
                :alt="bestRound.pokemon.name"
                class="h-36 w-36 object-contain drop-shadow-xl"
              >
              <div v-else class="grid h-36 w-36 place-items-center rounded-full bg-[#d8cfbd] text-sm font-bold">
                No sprite
              </div>
            </div>
            <p class="mt-4 text-3xl font-black">{{ bestRound.pokemon.name }}</p>
            <p class="mt-1 text-sm font-bold text-[#6f6252]">
              #{{ bestRound.pokemon.id }} / {{ bestRound.totalScore }} / {{ bestRound.maxScore }} points
            </p>
            <div class="mt-4 h-4 overflow-hidden rounded-full border-2 border-[#17130f] bg-[#fffaf0]">
              <div class="h-full bg-[#ffcf33]" :style="{ width: formatPercent(bestRound.accuracy) }" />
            </div>
          </article>

          <button
            type="button"
            class="w-full rounded-md border-2 border-[#17130f] bg-white px-5 py-3 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_#17130f] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#ffcf33]/40"
            @click="clearHistory"
          >
            Clear history
          </button>
        </aside>

        <section class="rounded-lg border-2 border-[#17130f] bg-white p-4 shadow-[8px_8px_0_#17130f] sm:p-6">
          <div class="flex flex-col justify-between gap-3 border-b-2 border-[#17130f] pb-5 sm:flex-row sm:items-end">
            <div>
              <p class="text-xs font-black uppercase tracking-[0.24em] text-[#c7352e]">Saved rounds</p>
              <h2 class="mt-2 text-3xl font-black tracking-tight">Most recent first</h2>
            </div>
            <p class="text-sm font-bold text-[#6f6252]">Exact = yellow, near = sand, miss = red.</p>
          </div>

          <div class="grid gap-4 pt-6">
            <article
              v-for="round in recentRounds"
              :key="round.id"
              class="rounded-md border-2 border-[#17130f] bg-[#fffaf0] p-4"
            >
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
                      #{{ round.pokemon.id }} / {{ formatDate(round.completedAt) }}
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
                        :class="scoreClass(guess.label)"
                        :title="`${guess.stat}: ${guess.points} points`"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    class="rounded-md border-2 border-[#17130f] bg-white px-3 py-2 text-xs font-black uppercase shadow-[3px_3px_0_#17130f] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#ffcf33]/40"
                    @click="history.removeRound(round.id)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>
      </section>

      <section v-else class="mx-auto grid min-h-[55vh] max-w-3xl place-items-center">
        <div class="rounded-lg border-2 border-[#17130f] bg-white p-8 text-center shadow-[8px_8px_0_#17130f]">
          <p class="text-xs font-black uppercase tracking-[0.24em] text-[#c7352e]">No local rounds</p>
          <h2 class="mt-3 text-4xl font-black">History starts after your first result</h2>
          <p class="mt-3 text-sm font-bold leading-6 text-[#6f6252]">
            Finish a round and it will be saved in this browser automatically.
          </p>
          <NuxtLink
            to="/play"
            class="mt-6 inline-block rounded-md border-2 border-[#17130f] bg-[#ffcf33] px-5 py-3 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_#17130f]"
          >
            Start round
          </NuxtLink>
        </div>
      </section>
    </section>
  </main>
</template>
