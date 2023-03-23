<template>
  <div class="min-h-screen flex flex-col bg-black text-white">
    <!-- Header -->
    <header class="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4 shadow-lg">
      <h1 class="text-2xl md:text-3xl font-bold text-white">Multiplication Game</h1>
    </header>

    <!-- Main Content -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 p-4 mt-4">
      <p class="text-sm text-gray-300">&copy; 2023 Multiplication Game. All rights reserved.</p>
    </footer>
  </div>
</template>
