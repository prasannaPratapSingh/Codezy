import axios from "axios"

const axiosClient = axios.create({
    baseURL: 'https://www.codezy.space',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;

