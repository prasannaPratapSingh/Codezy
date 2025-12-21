import axios from "axios"

const axiosClient = axios.create({
    baseURL: 'https://api.codezy.space',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;

