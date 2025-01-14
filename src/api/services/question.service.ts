import { axiosAuthInstance } from "@/api/middlewares/axiosInstance";
import { Question, QuestionFilters } from "@/types/Question";

class QuestionService{
    public getQuestions(page: number, limit: number, filters: QuestionFilters){
        return axiosAuthInstance.post('/question/get?page='+page+'limit='+limit,filters ).then
        (res => res.data).catch(err => err.response.data);
    }

    public addQuestion(question: any){
        return axiosAuthInstance.post('/question/create', question).then
        (res => res.data).catch(err => err.response.data);
    }

    public deleteQuestion(id: number){
        return axiosAuthInstance.delete(`/question/${id}`).then
        (res => res.data).catch(err => err.response.data);
    }

}

export default new QuestionService();