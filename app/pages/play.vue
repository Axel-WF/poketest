<script setup lang="ts">
import type { StatQuestion } from '../types/game'
import type { PokemonProfile, StatKey } from '../types/pokemon'
import { scoreRound } from '../utils/scoring'
import { shuffle } from '../utils/shuffle'

const settings = useSettingsStore()
const game = useGameStore()
const cache = usePokemonCacheStore()
const history = useHistoryStore()
const { getPokemonProfile } = usePokemonApi()
const { pickRandomPokemonId } = useGameRound()
const { createQuestions } = useStatOptions()

const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const selectedAnswers = ref<Partial<Record<StatKey, number>>>({})
const assistedStats = ref<StatKey[]>([])
const isSubmittingResults = ref(false)

const statLabels: Record<StatKey, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  specialAttack: 'Sp. Attack',
  specialDefense: 'Sp. Defense',
  speed: 'Speed'
}

const pokemon = computed(() => game.currentPokemon)
const questions = computed(() => game.questions)
const selectedCount = computed(() => Object.keys(selectedAnswers.value).length)
const roundComplete = computed(() => questions.value.length > 0 && selectedCount.value === questions.value.length)
const shouldShowBaseTotal = computed(() => settings.difficulty !== 'hard')

onMounted(() => {
  void startRound()
})

async function startRound(): Promise<void> {
  isLoading.value = true
  errorMessage.value = null
  selectedAnswers.value = {}
  assistedStats.value = []
  isSubmittingResults.value = false
  game.resetRound()

  const pokemonId = pickRandomPokemonId(settings.selectedGenerations)
  game.recordEvent({ type: 'ROUND_STARTED', payload: { pokemonId } })
  game.recordEvent({ type: 'POKEMON_REQUESTED', payload: { pokemonId } })

  try {
    const profile = await loadPokemonProfile(pokemonId)
    const generatedQuestions = createQuestions(profile.stats, settings.difficulty)

    game.currentPokemon = profile
    game.questions = generatedQuestions
    game.recordEvent({ type: 'POKEMON_FETCHED', payload: { pokemon: profile } })
    game.recordEvent({ type: 'OPTIONS_GENERATED', payload: { questions: generatedQuestions } })

    applyDifficultyAssists(generatedQuestions)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load Pokemon data.'
    errorMessage.value = message
    game.recordEvent({ type: 'POKEMON_FETCH_FAILED', payload: { pokemonId, message } })
  } finally {
    isLoading.value = false
  }
}

async function loadPokemonProfile(pokemonId: number): Promise<PokemonProfile> {
  const cached = cache.get(pokemonId)
  if (cached) return cached

  cache.trackRequest()
  const profile = await getPokemonProfile(pokemonId)
  cache.set(profile)

  return profile
}

function selectAnswer(question: StatQuestion, selectedValue: number): void {
  if (assistedStats.value.includes(question.stat)) return

  selectedAnswers.value = {
    ...selectedAnswers.value,
    [question.stat]: selectedValue
  }

  game.answerStat({
    stat: question.stat,
    selectedValue
  })
}

function applyDifficultyAssists(generatedQuestions: StatQuestion[]): void {
  if (settings.difficulty !== 'easy') return

  const assistedQuestions = shuffle(generatedQuestions).slice(0, 2)
  assistedStats.value = assistedQuestions.map((question) => question.stat)

  selectedAnswers.value = assistedQuestions.reduce<Partial<Record<StatKey, number>>>((answers, question) => {
    answers[question.stat] = question.actualValue
    return answers
  }, {})

  for (const question of assistedQuestions) {
    game.answerStat({
      stat: question.stat,
      selectedValue: question.actualValue
    })
  }
}

async function revealResults(): Promise<void> {
  if (!pokemon.value || !roundComplete.value || isSubmittingResults.value) return

  isSubmittingResults.value = true
  const result = scoreRound(pokemon.value, game.answers, game.questions)
  game.currentResult = result
  history.addRound(result)
  game.recordEvent({ type: 'ROUND_COMPLETED' })
  game.recordEvent({ type: 'SCORE_CALCULATED', payload: { result } })
  game.recordEvent({ type: 'HISTORY_PERSISTED', payload: { resultId: result.id } })

  await navigateTo('/results')
}

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
          <div class="rounded-md border-2 border-[#17130f] bg-white p-4">
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-xs font-black uppercase tracking-[0.18em] text-[#6f6252]">Pokemon ID</p>
                <p class="text-2xl font-black">#{{ pokemon.id }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs font-black uppercase tracking-[0.18em] text-[#6f6252]">Difficulty</p>
                <p class="text-lg font-black capitalize">{{ settings.difficulty }}</p>
              </div>
            </div>

            <div class="mt-4 grid place-items-center rounded-md bg-[#e9f2ff] p-4">
              <img
                v-if="pokemon.spriteUrl"
                :src="pokemon.spriteUrl"
                :alt="pokemon.name"
                class="h-44 w-44 object-contain drop-shadow-xl"
              >
              <div v-else class="grid h-44 w-44 place-items-center rounded-full bg-[#d8cfbd] text-sm font-bold">
                No sprite
              </div>
            </div>

            <h2 class="mt-4 text-3xl font-black">{{ pokemon.name }}</h2>
            <p v-if="pokemon.formName" class="mt-1 text-sm font-bold text-[#6f6252]">Form: {{ pokemon.formName }}</p>

            <div class="mt-4 flex flex-wrap gap-2">
              <span
                v-for="type in pokemon.types"
                :key="type"
                class="rounded-full border-2 border-[#17130f] bg-[#ffcf33] px-3 py-1 text-xs font-black uppercase"
              >
                {{ type }}
              </span>
            </div>
          </div>

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
          <article
            v-for="question in questions"
            :key="question.stat"
            class="rounded-md border-2 border-[#17130f] bg-[#fffaf0] p-4"
          >
            <div class="flex items-center justify-between gap-3">
              <h3 class="text-xl font-black">{{ statLabels[question.stat] }}</h3>
              <span
                v-if="assistedStats.includes(question.stat)"
                class="rounded-full bg-[#ffcf33] px-3 py-1 text-xs font-black uppercase text-[#17130f]"
              >
                Given
              </span>
              <span
                v-else-if="selectedAnswers[question.stat] !== undefined"
                class="rounded-full bg-[#dff6dd] px-3 py-1 text-xs font-black uppercase text-[#1e6d32]"
              >
                Locked
              </span>
              <span v-else class="rounded-full bg-[#efe4d0] px-3 py-1 text-xs font-black uppercase text-[#6f6252]">
                Open
              </span>
            </div>

            <div class="mt-4 grid grid-cols-3 gap-2">
              <button
                v-for="option in question.options"
                :key="option"
                type="button"
                class="rounded-md border-2 border-[#17130f] px-3 py-4 text-lg font-black shadow-[3px_3px_0_#17130f] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#ffcf33]/40"
                :class="
                  selectedAnswers[question.stat] === option
                    ? 'bg-[#ffcf33]'
                    : assistedStats.includes(question.stat)
                      ? 'bg-[#efe4d0] opacity-60'
                      : 'bg-white hover:bg-[#f7f3ea]'
                "
                :disabled="assistedStats.includes(question.stat)"
                :aria-pressed="selectedAnswers[question.stat] === option"
                @click="selectAnswer(question, option)"
              >
                {{ option }}
              </button>
            </div>
          </article>
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
