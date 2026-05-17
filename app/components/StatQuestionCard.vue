<script setup lang="ts">
import { statLabels } from '../constants/stats'
import type { StatQuestion } from '../types/game'
import type { StatKey } from '../types/pokemon'

const props = defineProps<{
  question: StatQuestion
  selectedValue?: number
  assistedStats: StatKey[]
}>()

const emit = defineEmits<{
  select: [question: StatQuestion, selectedValue: number]
}>()

const isAssisted = computed(() => props.assistedStats.includes(props.question.stat))
</script>

<template>
  <article class="rounded-md border-2 border-[#17130f] bg-[#fffaf0] p-4">
    <div class="flex items-center justify-between gap-3">
      <h3 class="text-xl font-black">{{ statLabels[question.stat] }}</h3>
      <span
        v-if="isAssisted"
        class="rounded-full bg-[#ffcf33] px-3 py-1 text-xs font-black uppercase text-[#17130f]"
      >
        Given
      </span>
      <span
        v-else-if="selectedValue !== undefined"
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
          selectedValue === option
            ? 'bg-[#ffcf33]'
            : isAssisted
              ? 'bg-[#efe4d0] opacity-60'
              : 'bg-white hover:bg-[#f7f3ea]'
        "
        :disabled="isAssisted"
        :aria-pressed="selectedValue === option"
        @click="emit('select', question, option)"
      >
        {{ option }}
      </button>
    </div>
  </article>
</template>
