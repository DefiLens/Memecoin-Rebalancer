import axios, { AxiosInstance } from 'axios';
import { BASE_URL } from './keys';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
    (config: any) => {
        config.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };
        return config;
    },
  (error: any) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response: any) => response,
  (error: any) => Promise.reject(error),
);

export default axiosInstance;
