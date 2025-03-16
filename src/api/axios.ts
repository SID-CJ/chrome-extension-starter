import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// https://axios-http.com/docs/instance

export default axios.create({
    baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {"Content-Type": "application/json"},
    withCredentials: true,
});
