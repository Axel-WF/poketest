<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  description: string
}>()
</script>

<template>
  <section class="border-b border-slate-200 pb-8">
    <p class="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
      {{ eyebrow }}
    </p>
    <h1 class="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
      {{ title }}
    </h1>
    <p class="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
      {{ description }}
    </p>
  </section>
</template>

