<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-black px-4">
    <h1 class="text-4xl md:text-6xl font-bold text-yellow-400 tracking-wide leading-none sm:leading-normal text-center">MULTIPLICATION<br class="sm:hidden"> GAME</h1>
    <p class="text-lg md:text-xl text-white mt-4">Test your multiplication skills!</p>
    <nuxt-link to="/game" class="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-6 py-2 rounded mt-6 text-white hover:opacity-90">Start</nuxt-link>
  </div>
</template>

<script>
export default {
  name: "index"
}
</script>

<style scoped>
</style>
