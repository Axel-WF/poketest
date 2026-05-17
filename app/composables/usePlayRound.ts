import type { StatQuestion } from '../types/game'
import type { PokemonProfile, StatKey } from '../types/pokemon'
import { scoreRound } from '../utils/scoring'
import { shuffle } from '../utils/shuffle'

export function usePlayRound() {
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

  const pokemon = computed(() => game.currentPokemon)
  const questions = computed(() => game.questions)
  const selectedCount = computed(() => Object.keys(selectedAnswers.value).length)
  const roundComplete = computed(() => questions.value.length > 0 && selectedCount.value === questions.value.length)
  const shouldShowBaseTotal = computed(() => settings.difficulty !== 'hard')

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

  return {
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
  }
}
