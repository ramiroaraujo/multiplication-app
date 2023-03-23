import { defineStore } from 'pinia';

interface Result {
    question: string;
    userAnswer: number;
    correctAnswer: number;
    correct: boolean;
}

export const useResultsStore = defineStore('results', {
    state: () => ({
        results: [] as Result[],
    }),
    actions: {
        saveResults(results: Result[]) {
            this.results = results;
        },
        clearResults() {
            this.results = [];
        }
    }
});
