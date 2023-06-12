import { createPinia, defineStore } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
export interface checkListInterface {
    selectedAnswer: string; 
    id: string; 
    Choice: { id: string; title: string; image: string | null; }[]; 
    QuestionAnswer: { choiceId: string; } | null; 
    title: string; 
    image: string | null; 
    isCorrect : boolean;
    
}
export const useQuestionListStore = defineStore("questionList", {
    state: () => {
        return {
            questionList: [] as checkListInterface[],
            currQuestionIndex: 0,
            lastRecordedTime : 0,
            grade: 0,
            isSubmitted : false
        }
    },
    actions: {
        getQIdx(){
            return this.currQuestionIndex
        },
        isEmptyList (){
            return this.questionList.length ==0;
        },
        checkIsSubmitted(){
            return this.isSubmitted
        },
        setTime(time: number){
            this.lastRecordedTime= time;
        },
        setQuestionList(questionList: checkListInterface[]) {
            this.questionList = questionList;
        },
        regiseterResponse(questionId: string, choiceId: string, time:number) {
            this.setTime(time);
            const question = this.questionList.find((obj) => obj.id === questionId);
            if (question) {
                question.selectedAnswer = choiceId;
            }
        },
        getIsQuestionAnswered(index: number) {
            const question = this.questionList[index];
            if (question) {
                return question.selectedAnswer !== "";
            }
        },
        getQuestion(){
            return this.questionList[this.currQuestionIndex];
        },
        setQuestionIndex(index: number) {
            this.currQuestionIndex = index;
        },
        resetState(){
            this.questionList= [];
            this.currQuestionIndex =0;
            this. lastRecordedTime =0;
            this.grade =0;
            this.isSubmitted = false;


        },
        calculateGrade(){
            this.currQuestionIndex = -2
            let g = 0 ;
            this.questionList.forEach(item => {
                if(item.selectedAnswer === item.QuestionAnswer?.choiceId){
                    item.isCorrect = true;
                    g+=1
                }
            });
            this.grade = g;
        }
    },
    persist: {
        storage: persistedState.localStorage,
    },
}
);
