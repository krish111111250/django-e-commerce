import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://django-e-commerce-production-f7fc.up.railway.app',
});

axiosInstance.interceptors.request.use((config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const { token } = JSON.parse(userInfo);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default axiosInstance;
