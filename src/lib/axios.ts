import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL 
})

api.interceptors.request.use( config => {//Conlos interceptors de axios, antes de cada request. se toma eltoken y se envia la configuracion de los headers y se le inyecta el token en la autorizacion
    const token = localStorage.getItem('AUTH_TOKEN')
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

//Se crea una instancia de axios a la url para despues realizar una petición 
export default api