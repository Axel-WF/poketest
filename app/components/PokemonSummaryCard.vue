<script setup lang="ts">
import type { PokemonProfile } from '../types/pokemon'

defineProps<{
  pokemon: PokemonProfile
  secondaryLabel: string
  secondaryValue: string
}>()
</script>

<template>
  <div class="rounded-md border-2 border-[#17130f] bg-white p-4">
    <div class="flex items-center justify-between gap-4">
      <div>
        <p class="text-xs font-black uppercase tracking-[0.18em] text-[#6f6252]">Pokemon ID</p>
        <p class="text-2xl font-black">#{{ pokemon.id }}</p>
      </div>
      <div class="text-right">
        <p class="text-xs font-black uppercase tracking-[0.18em] text-[#6f6252]">{{ secondaryLabel }}</p>
        <p class="text-lg font-black capitalize">{{ secondaryValue }}</p>
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
</template>
