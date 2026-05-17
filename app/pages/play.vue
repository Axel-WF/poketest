<script setup lang="ts">
const {
  settings,
  isLoading,
  errorMessage,
  selectedAnswers,
  assistedStats,
  isSubmittingResults,
  pokemon,
  questions,
  selectedCount,
  roundComplete,
  shouldShowBaseTotal,
  startRound,
  selectAnswer,
  revealResults
} = usePlayRound()

onMounted(() => {
  void startRound()
})
</script>

<template>
  <main class="min-h-screen bg-[#f7f3ea] px-4 py-6 text-[#17130f] sm:px-6 lg:px-10">
    <section class="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[360px_1fr]">
      <aside class="rounded-lg border-2 border-[#17130f] bg-[#fffaf0] p-5 shadow-[8px_8px_0_#17130f]">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-black uppercase tracking-[0.24em] text-[#c7352e]">Classic round</p>
            <h1 class="mt-2 text-4xl font-black tracking-tight">pokestatdle</h1>
          </div>
          <div class="flex flex-col gap-2">
            <button
              type="button"
              class="rounded-md border-2 border-[#17130f] bg-[#ffcf33] px-3 py-2 text-xs font-black uppercase tracking-wide shadow-[3px_3px_0_#17130f] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#ffcf33]/40"
              @click="startRound"
            >
              New
            </button>
            <NuxtLink
              to="/"
              class="rounded-md border-2 border-[#17130f] bg-white px-3 py-2 text-center text-xs font-black uppercase tracking-wide shadow-[3px_3px_0_#17130f] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#ffcf33]/40"
            >
              Menu
            </NuxtLink>
          </div>
        </div>

        <div v-if="isLoading" class="mt-8 rounded-md border-2 border-dashed border-[#17130f] p-6">
          <p class="text-sm font-bold uppercase tracking-wide">Fetching PokeAPI data...</p>
          <div class="mt-5 h-44 animate-pulse rounded-md bg-[#eadfca]" />
        </div>

        <div v-else-if="errorMessage" class="mt-8 rounded-md border-2 border-[#c7352e] bg-[#fff0ed] p-5">
          <p class="text-sm font-black uppercase tracking-wide text-[#c7352e]">Round failed</p>
          <p class="mt-2 text-sm leading-6">{{ errorMessage }}</p>
          <button
            type="button"
            class="mt-4 rounded-md bg-[#17130f] px-4 py-2 text-sm font-bold text-white"
            @click="startRound"
          >
            Try again
          </button>
        </div>

        <div v-else-if="pokemon" class="mt-7">
          <PokemonSummaryCard :pokemon="pokemon" secondary-label="Difficulty" :secondary-value="settings.difficulty" />
          <div class="mt-5 grid grid-cols-2 gap-3">
            <div class="rounded-md border-2 border-[#17130f] bg-[#17130f] p-4 text-white">
              <p class="text-xs font-black uppercase tracking-wide text-[#ffcf33]">Answered</p>
              <p class="mt-1 text-3xl font-black">{{ selectedCount }}/{{ questions.length }}</p>
            </div>
            <div class="rounded-md border-2 border-[#17130f] bg-white p-4">
              <p class="text-xs font-black uppercase tracking-wide text-[#6f6252]">Base total</p>
              <p class="mt-1 text-3xl font-black">{{ shouldShowBaseTotal ? pokemon.totalBaseStats : '???' }}</p>
            </div>
          </div>
        </div>
      </aside>

      <section class="rounded-lg border-2 border-[#17130f] bg-white p-4 shadow-[8px_8px_0_#17130f] sm:p-6">
        <div class="flex flex-col justify-between gap-4 border-b-2 border-[#17130f] pb-5 sm:flex-row sm:items-end">
          <div>
            <p class="text-xs font-black uppercase tracking-[0.24em] text-[#c7352e]">Guessing state</p>
            <h2 class="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Infer the six base stats</h2>
          </div>
          <p class="max-w-md text-sm font-semibold leading-6 text-[#6f6252]">
            Pick one value per stat. Easy mode gives two correct stats, medium shows base total, and hard hides all hints.
          </p>
        </div>

        <div v-if="isLoading" class="grid gap-4 pt-6 md:grid-cols-2">
          <div v-for="index in 6" :key="index" class="h-40 animate-pulse rounded-md bg-[#eee5d5]" />
        </div>

        <div v-else-if="pokemon && questions.length > 0" class="grid gap-4 pt-6 md:grid-cols-2">
          <StatQuestionCard
            v-for="question in questions"
            :key="question.stat"
            :question="question"
            :selected-value="selectedAnswers[question.stat]"
            :assisted-stats="assistedStats"
            @select="selectAnswer"
          />
        </div>

        <div v-else class="pt-6">
          <div class="rounded-md border-2 border-dashed border-[#17130f] p-8 text-center">
            <p class="text-lg font-black">No round loaded.</p>
            <button type="button" class="mt-4 rounded-md bg-[#17130f] px-4 py-2 font-bold text-white" @click="startRound">
              Start round
            </button>
          </div>
        </div>

        <div
          v-if="roundComplete"
          class="mt-6 flex flex-col gap-4 rounded-md border-2 border-[#17130f] bg-[#dff6dd] p-4 text-sm font-bold text-[#1e4d29] sm:flex-row sm:items-center sm:justify-between"
        >
          <span>All guesses selected. Reveal the score and stat deviations.</span>
          <button
            type="button"
            class="rounded-md border-2 border-[#17130f] bg-[#17130f] px-4 py-2 text-sm font-black uppercase tracking-wide text-white shadow-[3px_3px_0_#5aa366] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#17130f]/20 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isSubmittingResults"
            @click="revealResults"
          >
            Reveal results
          </button>
        </div>
      </section>
    </section>
  </main>
</template>
