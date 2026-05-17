<script setup lang="ts">
import type { Difficulty } from '../types/game'
import { generationRanges } from '../utils/generation-ranges'

const settings = useSettingsStore()
const generationOptions = Object.entries(generationRanges).map(([generation, range]) => ({
  id: Number(generation),
  label: `Gen ${generation}`,
  range: `${range.minId}-${range.maxId}`
}))

const difficultyOptions: Array<{
  value: Difficulty
  label: string
  description: string
}> = [
  {
    value: 'easy',
    label: 'Easy',
    description: 'Shows base total and gives two correct stats.'
  },
  {
    value: 'medium',
    label: 'Medium',
    description: 'Shows base total, but all stats are yours.'
  },
  {
    value: 'hard',
    label: 'Hard',
    description: 'Hides base total and gives no free stats.'
  }
]

async function startRound(): Promise<void> {
  await navigateTo('/play')
}

function toggleGeneration(generation: number): void {
  const isSelected = settings.selectedGenerations.includes(generation)

  if (isSelected && settings.selectedGenerations.length === 1) return

  settings.selectedGenerations = isSelected
    ? settings.selectedGenerations.filter((selectedGeneration) => selectedGeneration !== generation)
    : [...settings.selectedGenerations, generation].sort((first, second) => first - second)
}
</script>

<template>
  <main class="min-h-screen bg-[#f7f3ea] px-4 py-6 text-[#17130f] sm:px-6 lg:px-10">
    <section class="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl gap-6 lg:grid-cols-[1fr_420px] lg:items-center">
      <div class="rounded-lg border-2 border-[#17130f] bg-[#fffaf0] p-6 shadow-[8px_8px_0_#17130f] sm:p-8 lg:p-10">
        <p class="text-xs font-black uppercase tracking-[0.24em] text-[#c7352e]">Pokemon stat inference</p>
        <h1 class="mt-4 max-w-3xl text-6xl font-black tracking-tight sm:text-7xl lg:text-8xl">
          pokestatdle
        </h1>
        <p class="mt-6 max-w-2xl text-lg font-semibold leading-8 text-[#6f6252]">
          Guess six base stats from a random Pokemon profile. The game pulls from PokeAPI, generates shuffled
          percentage-based options, then scores how close your inference was.
        </p>

        <div class="mt-8 grid gap-3 sm:grid-cols-3">
          <div class="rounded-md border-2 border-[#17130f] bg-white p-4">
            <p class="text-xs font-black uppercase tracking-wide text-[#6f6252]">Stats</p>
            <p class="mt-1 text-3xl font-black">6</p>
          </div>
          <div class="rounded-md border-2 border-[#17130f] bg-[#17130f] p-4 text-white">
            <p class="text-xs font-black uppercase tracking-wide text-[#ffcf33]">Mode</p>
            <p class="mt-1 text-3xl font-black">Classic</p>
          </div>
          <div class="rounded-md border-2 border-[#17130f] bg-white p-4">
            <p class="text-xs font-black uppercase tracking-wide text-[#6f6252]">Pool</p>
            <p class="mt-1 text-3xl font-black">{{ settings.selectedGenerations.length }} gen</p>
          </div>
        </div>

        <div class="mt-8 border-t-2 border-[#17130f] pt-6">
          <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 class="text-2xl font-black">Pokemon generations</h2>
              <p class="mt-1 text-sm font-bold text-[#6f6252]">
                Toggle which generations can appear in random rounds.
              </p>
            </div>
            <p class="text-sm font-black uppercase text-[#6f6252]">
              {{ settings.selectedGenerations.length }} active
            </p>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <button
              v-for="generation in generationOptions"
              :key="generation.id"
              type="button"
              class="rounded-md border-2 border-[#17130f] px-4 py-2 text-sm font-black uppercase shadow-[3px_3px_0_#17130f] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#ffcf33]/40 disabled:cursor-not-allowed disabled:opacity-70"
              :class="
                settings.selectedGenerations.includes(generation.id)
                  ? 'bg-[#ffcf33] text-[#17130f]'
                  : 'bg-white text-[#17130f] hover:bg-[#f7f3ea]'
              "
              :aria-pressed="settings.selectedGenerations.includes(generation.id)"
              :title="generation.range"
              :disabled="
                settings.selectedGenerations.includes(generation.id) && settings.selectedGenerations.length === 1
              "
              @click="toggleGeneration(generation.id)"
            >
              {{ generation.label }}
            </button>
          </div>
        </div>
      </div>

      <aside class="rounded-lg border-2 border-[#17130f] bg-white p-5 shadow-[8px_8px_0_#17130f]">
        <div class="border-b-2 border-[#17130f] pb-5">
          <p class="text-xs font-black uppercase tracking-[0.24em] text-[#c7352e]">Round setup</p>
          <h2 class="mt-2 text-3xl font-black tracking-tight">Choose difficulty</h2>
          <p class="mt-3 text-sm font-bold leading-6 text-[#6f6252]">
            Difficulty controls how much information you get before guessing.
          </p>
        </div>

        <fieldset class="mt-5 space-y-3">
          <legend class="sr-only">Difficulty</legend>
          <label
            v-for="option in difficultyOptions"
            :key="option.value"
            class="block cursor-pointer rounded-md border-2 border-[#17130f] p-4 shadow-[3px_3px_0_#17130f] transition hover:-translate-y-0.5"
            :class="settings.difficulty === option.value ? 'bg-[#ffcf33]' : 'bg-[#fffaf0] hover:bg-[#f7f3ea]'"
          >
            <input v-model="settings.difficulty" class="sr-only" type="radio" name="difficulty" :value="option.value">
            <span>
              <span class="block text-xl font-black">{{ option.label }}</span>
              <span class="mt-1 block text-sm font-bold leading-5 text-[#6f6252]">{{ option.description }}</span>
            </span>
          </label>
        </fieldset>

        <button
          type="button"
          class="mt-6 w-full rounded-md border-2 border-[#17130f] bg-[#17130f] px-5 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[4px_4px_0_#ffcf33] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#17130f]/20"
          @click="startRound"
        >
          Start round
        </button>

        <NuxtLink
          to="/history"
          class="mt-3 block rounded-md border-2 border-[#17130f] bg-[#fffaf0] px-5 py-3 text-center text-sm font-black uppercase tracking-wide transition hover:bg-[#f7f3ea] focus:outline-none focus:ring-4 focus:ring-[#ffcf33]/40"
        >
          View history
        </NuxtLink>
      </aside>
    </section>
  </main>
</template>
