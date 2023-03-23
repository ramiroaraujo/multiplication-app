import {assign, createMachine} from "xstate";
import {random, sample, shuffle} from "lodash";

interface Context {
    selectedNumbers: number[],
    difficulty?: number,
    questions: any[],
    currentQuestionIndex: number,
    answers: string[],
    timer?: number,
}

const gameMachine = createMachine<Context>({
        predictableActionArguments: true,
        id: 'game',
        initial: 'selectNumbers',
        context: {
            selectedNumbers: [],
            difficulty: undefined,
            questions: [],
            currentQuestionIndex: 0,
            answers: [],
            timer: undefined,
        },
        states: {
            selectNumbers: {
                on: {
                    SELECT_NUMBER: {
                        actions: 'selectNumber',
                        cond: 'canSelectNumber',
                    },
                    NUMBERS_SELECTED: {
                        target: 'selectDifficulty',
                        cond: 'readyForDifficulty',
                    },
                },
            },
            selectDifficulty: {
                on: {
                    SELECT_DIFFICULTY: {
                        target: 'playing',
                        actions: ['selectDifficulty', 'generateQuestions'],
                    },
                },
            },
            playing: {
                initial: 'waitingForUserSelection',
                states: {
                    waitingForUserSelection: {
                        on: {
                            SELECT_ANSWER: {
                                target: 'roundResult',
                                actions: 'saveAnswer',
                            },
                            TIMEOUT: 'roundResult',
                        },
                    },
                    roundResult: {
                        on: {
                            NEXT_ROUND: [
                                {
                                    target: 'waitingForUserSelection',
                                    cond: 'hasMoreQuestions',
                                },
                                {
                                    target: '#game.finished',
                                    cond: 'noMoreQuestions',
                                },
                            ],
                        },
                    },
                },
            },
            finished: {
                type: 'final',
            }
        },
        // predictableActionArguments: true,
    },
    {
        guards: {
            canSelectNumber: (context, event) => context.selectedNumbers.length < 2,
            readyForDifficulty: (context, event) => context.selectedNumbers.length === 2,
            canPlay: (context) => context.difficulty !== undefined && context.questions.length === 2,
            hasMoreQuestions: (context) => context.currentQuestionIndex + 1 < context.questions.length + 1,
            noMoreQuestions: (context) => context.currentQuestionIndex + 1 >= context.questions.length + 1,
        },
        actions: {
            selectNumber: (context, event) => {
                context.selectedNumbers.push(event.number)
            },
            selectDifficulty: (context, event) => {
                context.difficulty = event.difficulty
            },
            generateQuestions: assign({
                questions: (context) => {
                    const { selectedNumbers, difficulty } = context;
                    const questions = [];
                    const questionSet = new Set();

                    while (questions.length < 10) {
                        const n = sample(selectedNumbers)!;
                        const m = random(2, 9);

                        const key = `${n}x${m}`;

                        if (!questionSet.has(key)) {
                            questionSet.add(key);
                            const correct = n * m;

                            const wrongOptions: number[]= [];

                            const options = [ correct + 1, correct - 1, (n+1) * m, (n-1) * m, n * (m+1), n * (m-1) ];
                            while (wrongOptions.length < difficulty! - 1) {
                                let wrongAnswer = sample(options)!;
                                if (wrongAnswer !== correct && !wrongOptions.includes(wrongAnswer)) {
                                    wrongOptions.push(wrongAnswer);
                                }
                            }

                            questions.push({
                                question: key,
                                options: shuffle([ ...wrongOptions, correct ]),
                                answer: null,
                                correct,
                            });
                        }
                    }

                    return questions;
                },
            }),
            saveAnswer: (context, event) => {
                context.answers[context.currentQuestionIndex] = event.answer
            },
        },
    })

export default gameMachine;