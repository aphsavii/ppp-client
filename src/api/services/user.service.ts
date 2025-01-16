import { axiosInstance } from "@/api/middlewares/axiosInstance";
import { axiosAuthInstance } from "@/api/middlewares/axiosInstance";

class UserService {
    login(regno: string, password: string) {
        return axiosInstance.post('/user/login', { regno, password }).then
            (res => res.data).catch(err => Promise.reject(err.response.data));
    }
    register(name: string, regno: string, trade: string, batch: string, password: string) {
        return axiosInstance.post('/user/register', { name, regno, trade, batch, password }).then
            (res => res.data).catch(err => Promise.reject(err.response.data));
    }
    verifySession() {
        return axiosAuthInstance.get('/user/verify-session').then
            (res => res.data).catch(err => Promise.reject(err.response.data));
    }
    sendOTP(regno: string) {
        return axiosInstance.get('/user/generate-otp/' + regno).then(res => res.data).catch(err => Promise.reject(err));
    }
    resetPassword(regno: string, otp: string, password: string) {
        return axiosInstance.post('/user/forgot-password', { regno, otp, password }).then(res => res.data).catch(err => Promise.reject(err));
    }
    getUserDashBoard() {
        return  axiosAuthInstance.get('/user/dashboard').then(res => res.data).catch(err => Promise.reject(err));
    }
}

export default new UserService();