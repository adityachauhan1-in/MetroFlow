// backend connect with the frontend 
import axios from 'axios';
// Creates a custom axios client
// API routes are under /api on the backend (see backend app.js).
// - Dev: local server. - Prod default: your Render API host (split deploy: static site → API).
// - Same-origin monolith on Render: set VITE_API_URL=/api in the frontend build env.
const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        (import.meta.env.DEV
            ? "http://localhost:5000/api"
            : "https://metroflow-kjnk.onrender.com/api"),
    headers:{
        "Content-Type":"application/json",
    },

})
// request interceptors ==>User send request <===
/* =========
REQUEST INTERCEPTOR
=========*/
api.interceptors.request.use( //Runs before every request
    (config) => {
        const token = localStorage.getItem("token")
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
/* =========
RESPONSE INTERCEPTOR
=========*/
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const url = error.config?.url || "";
            const isAuthRequest = url.includes("/user/login") || url.includes("/user/signup");
            if (!isAuthRequest) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);
export default api