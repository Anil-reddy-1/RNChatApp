import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"


const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_BACK_URL,
})

api.interceptors.request.use(async (config:any)=>{
    const Data = await AsyncStorage.getItem('ChatUserData')
    const userData=Data?JSON.parse(Data):null;
    let token;
    if (userData)
        token = userData.token;
    else
        token = ""
    config.headers.Authorization='Bearer'+token;

    return config;
})



export { api }

