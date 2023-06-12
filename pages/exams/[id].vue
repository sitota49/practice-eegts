<script setup lang="ts">
import { useQuestionListStore } from '~/stores/questions';

const route = useRoute()
const examId = route.params.id as string;
const { $client } = useNuxtApp();
const question = ref();
const timeLeft = ref();

const showErrorText = ref(false);
const isLoadingSubmitExam = ref(false);
const isLoadingRegisterResponse = ref(false);
const showGradeReview = ref(false);
const showQuestions = ref(true);
const showReviewMessage = ref(false);
const questionListStore = useQuestionListStore();
if (questionListStore.getQIdx() == -2) {
    showGradeReview.value = true;
    showQuestions.value = false;
}
const loadingQuestion = ref(false);
var refreshIntervalId: any;
const startCountDown = () => {
    refreshIntervalId = setInterval(() => {
        if (timeLeft.value > 0) {
            timeLeft.value--;
        } else {
            clearInterval(refreshIntervalId);
            handlesubmit();
        }
    }, 1000)
}
const hours = computed(() => {
    return Math.floor(timeLeft.value / 3600)
        .toString()
        .padStart(2, '0')
});
const minutes = computed(() => {
    return Math.floor((timeLeft.value % 3600) / 60)
        .toString()
        .padStart(2, '0')
});
const seconds = computed(() => {
    return (timeLeft.value % 60).toString().padStart(2, '0')
});
const navigateQ = async (direction: string, changed: boolean, selectedAnswer?: string, questionId?: string) => {
    if (changed) {
        isLoadingRegisterResponse.value = true;
        questionListStore.regiseterResponse(questionId as string, selectedAnswer as string, timeLeft.value);
        if (direction == 'next') {
            await nextQ();
        }
        else {
            await prevQ();
        }
        isLoadingRegisterResponse.value = false;

    } else {
        if (direction == 'next') {
            await nextQ();
        }
        else {
            await prevQ();
        }
    }

}
const loadQuestion = async () => {
    loadingQuestion.value = true;
    const data = questionListStore.getQuestion();
    question.value = data;
    loadingQuestion.value = false;
}
const setQ = async (index: number) => {
    showReviewMessage.value = false;
    questionListStore.setQuestionIndex(index);
    idx.value = questionListStore.currQuestionIndex;
    await loadQuestion();
}
const prevQ = async () => {
    if (idx.value > 0) {
        questionListStore.setQuestionIndex(idx.value - 1);
        idx.value = questionListStore.currQuestionIndex;
    }
    await loadQuestion();
}
const nextQ = async () => {
    if (examDetail.value) {
        if (idx.value < examDetail?.value?.numberOfQuestions! - 1) {
            questionListStore.setQuestionIndex(idx.value + 1);
            idx.value = questionListStore.currQuestionIndex;
            await loadQuestion();
        } else if (idx.value === examDetail?.value?.numberOfQuestions! - 1) {
            showReviewMessage.value = true;
            questionListStore.setQuestionIndex(-1);
            idx.value = questionListStore.currQuestionIndex;
        }
    }

}

const handlesubmit = () => {
    isLoadingSubmitExam.value = true;
    clearInterval(refreshIntervalId);
    questionListStore.calculateGrade();
    showGradeReview.value = true;
    showQuestions.value= false;
    isLoadingSubmitExam.value = false;

}

const idx = ref(questionListStore.currQuestionIndex);

const { data: examDetail, pending: examDetailsPending } = await useAsyncData(() => $client.exam.getExamDetail.query({ examId }));
if (examDetail) {
    if (questionListStore.currQuestionIndex == -2) {
        showGradeReview.value = true;
    } else {

        if (questionListStore.isEmptyList()) {
            const questions = examDetail.value?.Questions.map((q) => {
                return { ...q, selectedAnswer: "" as string, isCorrect: false }
            })
            questionListStore.setQuestionList(questions!);
            questionListStore.setTime(examDetail.value?.duration! * 60);
        }
        timeLeft.value = questionListStore.lastRecordedTime;
        loadQuestion();
        startCountDown();
    }
}
const numEntries = examDetail.value?.numberOfQuestions || 0;

const numRows = Math.ceil(numEntries / 5);
const numCols = 5;

const tableData = computed(() => {
    let number = 1;
    const tableData = [];

    for (let i = 0; i < numRows; i++) {
        const row = [];
        for (let j = 0; j < 5; j++) {
            if (number <= numEntries) {
                row.push(number.toString().padStart(numEntries.toString().length, '0'));
                number++;
            }
        }
        tableData.push(row);
    }


    return tableData;
},
);
</script>
<template>
    <TopBar />

    <div class="mx-10">

        <div v-if="examDetail">

            <div class="flex flex-row mt-10 mb-3 mx-3 align-middle">
                <NuxtLink :to="`/${examDetail.examGroupId}`">
                        <Icon name="mdi:chevron-left" class="h-8 w-8  "></Icon>
                    </NuxtLink>
                <Icon name="iconoir:page" class="w-8 h-8 mr-2 ml-10"></Icon>
                <p class="text-3xl font-md">{{ examDetail.name }}</p>
            </div>
            <div v-if="showGradeReview" class="ml-10 mb-10">
                <h1 class="text-xl mt-10 font-bold">
                   You got  {{ questionListStore.grade }} / {{ examDetail.numberOfQuestions }} {{examDetail.numberOfQuestions ===1  ? 'question' : 'questions'}} correct
                </h1>
                <div v-for="question in questionListStore.questionList">
                    <div class="p-4">
                        <div v-html="question.title" class="p-2 text-xl my-2"></div>
                        <img v-if="question.image" :src=question.image class="ml-3" style="width: 10em; height: 10em; " />
                    </div>
                    <ul  class="ml-10">
                        <div v-for="choice in question.Choice" :key="choice.id">

                            <li>
                                <div class="flex lfex-row">

                                    <div v-html="choice.title" class="px-2 text-lg -mt-1" :class="{'text-green-600' :(  choice.id === question.QuestionAnswer?.choiceId && choice.id == question.selectedAnswer), 'text-red-600' :(  choice.id !== question.QuestionAnswer?.choiceId && choice.id == question.selectedAnswer)}"></div> 
                                    <div v-if=" choice.id === question.QuestionAnswer?.choiceId" class="text-green-600"> {{"<-- Correct Answer"}}</div>
                                </div>
                                <img v-if="choice.image" :src=choice.image style="width: 10em; height: 10em;" />
                            </li>
                        </div>
                       
                    </ul>
                </div>
            </div>
            <div v-if="showQuestions">
                <div class="flex flex-row">

                    <div class="w-8/12 ml-16">
                        <div v-if="!showReviewMessage">
                            <div v-if="question">

                                <form>

                                    <div class="p-4">
                                        <div v-html="question.title" class="p-2 text-xl my-2"></div>
                                        <img v-if="question.image" :src=question.image class="ml-3"
                                            style="width: 10em; height: 10em; " />
                                    </div>

                                    <div v-for="choice in question.Choice" :key="choice.id" class="ml-10">

                                        <div class="flex flex-row align-middle my-3">
                                            <input id="radio_1" type="radio" name="radio" :value="choice.id"
                                                v-model="question.selectedAnswer" @change="question.changed = true">
                                            <label class="pl-2 " for="radio_1">


                                                <div v-html="choice.title" class="px-2 text-lg -mt-1"></div>
                                                <img v-if="choice.image" :src=choice.image
                                                    style="width: 10em; height: 10em;" />

                                            </label>
                                        </div>
                                    </div>
                                </form>
                                <div class="flex flex-row my-5 w-10/12 ">

                                    <div v-if="idx < examDetail!.numberOfQuestions" class="py-3 ml-auto w-1/12 mb-20">
                                        <button
                                            @click="navigateQ('next', question.changed, question.selectedAnswer, question.id)"
                                            class="btn btn-primary py-2" :disabled="isLoadingRegisterResponse">
                                            <div v-if="isLoadingRegisterResponse">
                                                <Icon name="eos-icons:bubble-loading" class="w-6 h-6 text-white"></Icon>
                                            </div>
                                            <div v-else class="text-xl">
                                                Next
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div v-else>
                            <div class="text-center mx-auto my-auto justify-center align-text-middle items-center h-screen">
                                <div class="my-40">

                                    <h1 class="text-3xl font-bold ">
                                        Make sure you have reviewed all questions before submitting the exam.
                                    </h1>
                                    <button @click="handlesubmit" class="btn btn-primary text-xl p-3 mt-10"
                                        :disabled="isLoadingSubmitExam">
                                        <div v-if="isLoadingSubmitExam">
                                            <Icon name="eos-icons:bubble-loading" class="w-6 h-6"></Icon>
                                        </div>
                                        <div v-else>
                                            Submit Exam
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-3/12 ">
                        <div class="w-full">
                            <p class="font-bold text-2xl text-center py-5">Time Left :- {{ hours }}:{{ minutes }}:{{ seconds
                            }}
                            </p>
                        </div>
                        <div class="w-9/12 mx-20 shadow-lg py-5 rounded-xl">
                            <div class="bg-primary  text-white text-center text-xl py-5 px-auto rounded-t-xl">
                                Exam Navigation
                            </div>
                            <table class="w-8/12 my-5 mx-auto">
                                <tbody>
                                    <tr v-for="row in tableData">
                                        <td v-for="cell in row" class="table-cell">
                                            <button class="button p-2" @click="setQ(parseInt(cell) - 1)"
                                                :class="{ 'font-bold bg-primary text-white text-lg': idx + 1 === parseInt(cell), 'bg-blue-400 text-lg text-white font-bold': questionListStore.getIsQuestionAnswered(parseInt(cell) - 1), 'bg-gray-300 text-lg font-bold': !questionListStore.getIsQuestionAnswered(parseInt(cell) - 1) }">{{
                                                    cell }}</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>


                    </div>



                </div>
            </div>

        </div>
    </div>
    <div v-if="examDetailsPending"
        class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
        <div class="relative  my-6 mx-auto max-w-10xl">
            <!--content-->
            <div class="border-0 rounded-lg relative flex flex-col w-full outline-none focus:outline-none">
                <!--header-->
                <div class="flex items-start justify-between p-5 rounded-t">
                    <!-- <h3 class="text-3xl font-semibold">
                                                Modal Title
                                            </h3> -->
                    <!-- <button
                                                class="ml-auto text-gray-500 hover:text-black bg-transparent font-bold uppercase text-sm py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button" v-on:click="toggleDeleteModal()">
                                                <Icon name="iconoir:cancel" class="w-6 h-6"></Icon>
                                            </button> -->
                </div>
                <!--body-->
                <div class="relative p-6 flex-auto">


                    <div class="flex flex-row items-center space-x-4 mx-auto">
                        <Icon name="eos-icons:bubble-loading" class="w-20 h-20 text-primary"></Icon>

                    </div>
                </div>
                <!--footer-->

            </div>
        </div>
    </div>
    <div v-if="examDetailsPending" class="opacity-20 fixed inset-0 z-40 bg-black">
    </div>

    <div v-if="showErrorText"
        class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
        <div class="relative  my-6 mx-auto max-w-10xl">
            <!--content-->
            <div class="border-0 rounded-lg relative flex flex-col w-full outline-none focus:outline-none">
                <!--header-->
                <div class="flex items-start justify-between p-5 rounded-t">
                    <!-- <h3 class="text-3xl font-semibold">
                                                Modal Title
                                            </h3> -->
                    <!-- <button
                                                class="ml-auto text-gray-500 hover:text-black bg-transparent font-bold uppercase text-sm py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button" v-on:click="toggleDeleteModal()">
                                                <Icon name="iconoir:cancel" class="w-6 h-6"></Icon>
                                            </button> -->
                </div>
                <!--body-->
                <div class="relative p-6 flex-auto">


                    <div class="flex flex-row items-center space-x-4 mx-auto">
                        <h1 class="text-lg text-center text-red-500">
                            You are offline. Please check your internet connection and try again.
                        </h1>

                    </div>
                </div>
                <!--footer-->

            </div>
        </div>
    </div>
    <div v-if="showErrorText" class="opacity-20 fixed inset-0 z-40 bg-black"></div>
</template>

