<template>
  <div v-if="state" class="min-h-screen bg-black p-4 md:p-8">
    <h1 class="text-3xl md:text-4xl font-bold text-yellow-400 mb-8">Multiplication Game</h1>

    <!-- Select Numbers State -->
    <div v-if="state.matches('selectNumbers')" class="mb-8">
      <p class="text-white text-lg md:text-xl mb-4">Select two numbers (2-9):</p>
      <button
          v-for="number in numbers"
          :key="number"
          class="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-2xl px-5 py-3 m-1 rounded hover:opacity-90"
          @click="handleSelectNumber(number)"
      >
        {{ number }}
      </button>
    </div>

    <!-- Select Difficulty State -->
    <div v-if="state.matches('selectDifficulty')" class="mb-8">
      <p class="text-white text-lg md:text-xl mb-4">Select difficulty (3-5):</p>
      <button
          v-for="level in [3, 4, 5]"
          :key="level"
          class="bg-gradient-to-r from-green-500 via-purple-500 to-pink-500 text-white text-2xl px-5 py-3 m-1 rounded hover:opacity-90"
          @click="handleSelectDifficulty(level)"
      >
        {{ level }}
      </button>
    </div>

    <!-- Playing State -->
    <div v-if="state.matches('playing')">
      <!-- Waiting for User Selection State -->
      <div v-if="state.matches('playing.waitingForUserSelection')" class="mb-8">
        <p class="text-white text-lg md:text-xl mb-4">
          Question {{ state.context.currentQuestionIndex + 1 }}: What is the result of {{ state.context.questions[state.context.currentQuestionIndex].question }}?
        </p>
        <button
            v-for="option in state.context.questions[state.context.currentQuestionIndex].options"
            :key="option"
            class="bg-gradient-to-r from-purple-500 via-purple-500 to-pink-500 text-white text-2xl px-5 py-3 m-1 rounded hover:opacity-90"
            @click="handleSelectAnswer(option)"
        >
          {{ option }}
        </button>
      </div>

      <!-- Round Result State -->
      <div v-if="state.matches('playing.roundResult')" class="mb-8">
        <p class="text-xl">
          <span v-if="isCorrectAnswer" class="text-green-400">Correct!</span>
          <span v-else class="text-red-400">Incorrect. The correct answer is {{ correctAnswer }}.</span>
        </p>
      </div>
    </div>

    <!-- Finished State -->
    <div v-if="state.matches('finished')">
      <p class="text-white text-lg md:text-xl mb-4">Game finished! Check your results:</p>
      <nuxt-link to="/results" class="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-6 py-2 rounded mt-6 text-white hover:opacity-90">Results</nuxt-link>
    </div>
  </div>
</template>


<script>
import { useMachine } from "@xstate/vue"
import gameMachine from "~/machines/gameMachine";
import { watchEffect } from 'vue';
import {useResultsStore} from "~/stores/resultsStore";

export default {
  setup() {
    const { state, send } = useMachine(gameMachine);
    const results = useResultsStore();

    let numbers = [2, 3, 4, 5, 6, 7, 8, 9];


    return {
      state,
      send,
      results,
      numbers
    };
  },
  watch: {
    state: {
      handler: function (newVal, oldVal) {
        if (newVal.value === 'finished') {
          const questions = this.state.context.questions;
          const answers = this.state.context.answers;

          this.results.saveResults(questions.map((question, index) => ({
            question: question.question,
            userAnswer: answers[index],
            correctAnswer: question.correct,
            correct: question.correct === answers[index]
          })));
        }

      },
      deep: true
    }
  },
  methods: {
    handleSelectNumber(number) {
      this.send('SELECT_NUMBER', { number });
      const { selectedNumbers } = this.state.context;
      this.numbers = this.numbers.filter(n => n !== number);

      if (selectedNumbers.length === 2) {
        this.send('NUMBERS_SELECTED');
      }
    },

    handleSelectDifficulty(level) {
      this.send('SELECT_DIFFICULTY', { difficulty: level })
    },

    handleSelectAnswer(answer) {
      this.send('SELECT_ANSWER', { answer })
      setTimeout(() => {
        this.state.context.currentQuestionIndex++
        this.send('NEXT_ROUND')
      }, 300)
    },
  },
  computed: {
    isCorrectAnswer() {
      return (
          this.state.context.answers[this.state.context.currentQuestionIndex] ===
          this.state.context.questions[this.state.context.currentQuestionIndex].correct
      )
    },
    correctAnswer() {
      return this.state.context.questions[this.state.context.currentQuestionIndex].correct
    },
  }
};

</script>

<style scoped>

</style>