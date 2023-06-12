// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@huntersofbook/naive-ui-nuxt',
    "nuxt-icon", 
    "@nuxtjs/supabase",  
   '@vueuse/nuxt',
   '@pinia/nuxt',  '@pinia-plugin-persistedstate/nuxt', 
  ],
  build: {
    transpile: [
      'trpc-nuxt'
    ]
  },
  typescript: {
    shim: false
  },
  css: ["@/assets/css/app.css"],
  runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
  },
})
