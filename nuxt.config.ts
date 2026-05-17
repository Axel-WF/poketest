export default defineNuxtConfig({
  srcDir: 'app',
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@vueuse/nuxt', '@nuxtjs/tailwindcss', '@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  ssr: true,
  nitro: {
    preset: 'static'
  },
  runtimeConfig: {
    public: {
      pokeapiBaseUrl: process.env.NUXT_PUBLIC_POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2'
    }
  },
  typescript: {
    strict: true,
    typeCheck: true
  },
  app: {
    head: {
      title: 'pokestatdle',
      meta: [
        {
          name: 'description',
          content:
            'pokestatdle is a Nuxt 3 analytical inference game using PokeAPI data, normalized domain models, event driven state, scoring, and performance analytics.'
        }
      ]
    }
  }
})
