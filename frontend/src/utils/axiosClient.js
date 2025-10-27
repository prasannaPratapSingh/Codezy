import axios from "axios"

const axiosClient = axios.create({
    baseURL: 'https://final-code-qrxd.onrender.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;

