<script setup lang="ts">
import { useQuestionListStore } from '~/stores/questions';
const questionListStore = useQuestionListStore();
const route = useRoute()
const examGroupId = route.params.id as string;
const isReloading = ref(false);
const page = ref(1);
const searchPage = ref(1);
const searchText = ref('');
const { $client } = useNuxtApp();
const { data: count, refresh: fetchCount } = await useAsyncData(() => $client.exam.getExamsCount.query({ examGroupId }));
const { data: exams, refresh: fetchExams, pending } = await useAsyncData(() => $client.exam.getExams.query({ skip: (page.value - 1) * 6, examGroupId }),
    { watch: [page, searchText] });
const { data: searchCount, refresh: fetchSearchCount } = await useAsyncData(() => $client.exam.searchExamsCount.query({ search: searchText.value !== '' ? searchText.value : undefined, examGroupId }), { watch: [searchPage, searchText] });
const { data: searchExams, refresh: fetchSearchExams, pending: pendingSearch } = await useAsyncData(() => $client.exam.getSearchedExams.query({ search: searchText.value !== '' ? searchText.value : undefined, skip: (searchPage.value - 1) * 6, examGroupId }),
    { watch: [page, searchText] });

const paginate = async (newPage: number) => {
    page.value = newPage;
    isReloading.value = true;
    try {
        await fetchExams();
        await fetchCount();
    } finally {
        isReloading.value = false
    }
}

const paginateSearch = async (newPage: number) => {
    searchPage.value = newPage;
    isReloading.value = true;
    try {
        await fetchSearchExams();
        await fetchSearchCount();
    } finally {
        isReloading.value = false
    }
}

const resetSearch = () => {
    if (searchText.value === "") {
        searchPage.value = 1;
        page.value = 1;
    }
}
const startExam = (examId :string)=>{
    questionListStore.resetState();
    navigateTo(`/exams/${examId}`)
}



</script>
<template>
    <TopBar />
    <div class="w-3/4 mx-auto"> 
        <div class="grid grid-cols-12 gap-6 mt-5">
            <div class="intro-y col-span-12 flex flex-row sm:flex-nowrap items-center mt-2">

                <div class="hidden md:block mx-auto text-slate-500">

                </div>
                <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                    <div class="w-56 relative text-slate-500">
                        <input type="text" class="form-control w-56 box pr-10" v-model="searchText" placeholder="Search..."
                            @change="resetSearch" />
                        <Icon name="carbon:search" class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"></Icon>

                    </div>
                </div>
            </div>


            <!-- BEGIN: Data List -->
            <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">

                <div v-if="searchText != ''">
                    <div v-if="searchExams?.length == 0" class="w-full text-center text-lg mt-10 h-full">
                        <p>No exams found</p>
                    </div>
                    <div v-if="searchExams?.length !== 0">
                        <table class="table table-report -mt-2">
                            <thead>
                                <tr>
                                    <th class="whitespace-nowrap"></th>
                                    <th class="whitespace-nowrap w-2/12">Exams</th>
                                    <th class="text-center whitespace-nowrap w-2/12">Number of Questions</th>

                                    <th class=" text-center whitespace-nowrap w-2/12">Exam Duration(mins)</th>
                                    <th class="text-center whitespace-nowrap w-full">ACTIONS</th>
                                </tr>
                            </thead>



                            <tbody>

                                <tr v-for="exam in searchExams" :key="exam.id" class="intro-x">
                                    <td class="w-10">
                                        <Icon name="iconoir:page" class="w-6 h-6"></Icon>

                                    </td>
                                    <td class="font-medium whitespace-nowrap w-2/12 ">

                                        {{
                                            exam.name.length > 40 ? exam.name.slice(0, 39) + "..." : exam.name
                                        }}

                                    </td>

                                    <td class="text-center w-2/12">{{ exam.numberOfQuestions }}</td>

                                    <td class=" text-center w-2/12">{{ exam.duration }}</td>
                                    <td class="items-center">


                                        <div class="flex justify-center items-center">
                                            <a class="text-success flex items-center mr-3" :href="`/exams/${exam.id}`">
                                                <Icon name="material-symbols:play-circle" class="w-4 h-4"></Icon> Start Exam
                                            </a>

                                        </div>

                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="flex flex-row mt-3">
                            <div class="md:block  text-slate-500">

                            </div>
                            <div
                                class=" ml-auto intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
                                <nav class="w-full sm:w-auto sm:mr-auto">
                                    <ul class="pagination">

                                        <li class="page-item">
                                            <button class="page-link" v-on:click="paginateSearch(searchPage - 1)"
                                                :disabled="searchPage === 1">
                                                <div class="flex flex-row align-middle justify-center items-center  ">
                                                    <Icon name="mdi:chevron-left" class="h-4 w-4 align-middle"></Icon>
                                                    <span class="">Previous</span>
                                                </div>
                                            </button>
                                        </li>
                                        <li class="page-item">
                                            <button class="page-link" v-on:click="paginateSearch(searchPage + 1)"
                                                :disabled="(searchPage) * 6 >= searchCount!">
                                                <div class="flex flex-row align-middle justify-center items-center">
                                                    <span>Next</span>
                                                    <Icon name="mdi:chevron-right" class="h-4 w-4 align-middle"></Icon>
                                                </div>
                                            </button>
                                        </li>


                                    </ul>
                                </nav>

                            </div>
                        </div>


                    </div>




                </div>
                <div v-else>
                    <div v-if="exams?.length == 0" class="w-full text-center text-lg mt-10 h-full">
                        <p>No exams found</p>
                    </div>
                    <div v-if="exams?.length !== 0">
                        <table class="table table-report -mt-2">
                            <thead>
                                <tr>
                                    <th class="whitespace-nowrap"></th>
                                    <th class="whitespace-nowrap w-2/12">Exams</th>
                                    <th class="text-center whitespace-nowrap w-2/12">Number of Questions</th>
                                    <th class=" text-center whitespace-nowrap w-2/12">Exam Duration(mins)</th>
                                    <th class="text-center whitespace-nowrap w-full">ACTIONS</th>
                                </tr>
                            </thead>



                            <tbody>

                                <tr v-for="exam in searchExams" :key="exam.id" class="intro-x">
                                    <td class="w-10">
                                        <Icon name="iconoir:page" class="w-6 h-6"></Icon>

                                    </td>
                                    <td class="font-medium whitespace-nowrap w-2/12 ">

                                        {{
                                            exam.name.length > 40 ? exam.name.slice(0, 39) + "..." : exam.name
                                        }}

                                    </td>

                                    <td class="text-center w-2/12">{{ exam.numberOfQuestions }}</td>

                                    <td class=" text-center w-2/12">{{ exam.duration }}</td>
                                    <td class="items-center">


                                        <div class="flex justify-center items-center">
                                            <a class="text-success flex items-center mr-3" @click="startExam(exam.id)">
                                                <Icon name="material-symbols:play-circle" class="w-4 h-4"></Icon> Start Exam
                                            </a>

                                        </div>

                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="flex flex-row mt-3">
                            <div class="md:block  text-slate-500">

                            </div>
                            <div
                                class=" ml-auto intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
                                <nav class="w-full sm:w-auto sm:mr-auto">
                                    <ul class="pagination">

                                        <li class="page-item">
                                            <button class="page-link" v-on:click="paginate(page - 1)"
                                                :disabled="page === 1">
                                                <div class="flex flex-row align-middle justify-center items-center  ">
                                                    <Icon name="mdi:chevron-left" class="h-4 w-4 align-middle"></Icon>
                                                    <span class="">Previous</span>
                                                </div>
                                            </button>
                                        </li>
                                        <li class="page-item">
                                            <button class="page-link" v-on:click="paginate(page + 1)"
                                                :disabled="(page) * 6 >= count!">
                                                <div class="flex flex-row align-middle justify-center items-center">
                                                    <span>Next</span>
                                                    <Icon name="mdi:chevron-right" class="h-4 w-4 align-middle"></Icon>
                                                </div>
                                            </button>
                                        </li>


                                    </ul>
                                </nav>

                            </div>
                        </div>


                    </div>

                </div>
                </div>
                </div>
                </div>
</template>