<template>
  <div class="min-h-screen bg-black p-8">
    <h1 class="text-4xl font-bold text-yellow-400">Results</h1>
    <table class="table-fixed w-full mt-8 text-white mb-5">
      <thead>
      <tr>
        <th class="w-1/4">Question</th>
        <th class="w-1/4">Your Answer</th>
        <th class="w-1/4">Correct Answer</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(result, index) in results" :key="index" class="w-1/4 text-center">
        <td>{{ result.question }}</td>
        <td :class="result.correct ? 'text-green-400' : 'text-red-500'">{{ result.userAnswer }}</td>
        <td>{{ result.correctAnswer }}</td>
      </tr>
      </tbody>
    </table>
    <nuxt-link to="/" class="bg-blue-500 px-6 py-2 rounded mt-6 text-white hover:bg-blue-600">Replay</nuxt-link>
  </div>
</template>

<script>

import {useResultsStore} from "~/stores/resultsStore";

export default {
  setup() {
    const resultsStore = useResultsStore();
    //if no results, redirect to home
    if (resultsStore.results.length === 0) {
      navigateTo('/');
    }
    return {
      results: resultsStore.results,
    };
  }
}
</script>
