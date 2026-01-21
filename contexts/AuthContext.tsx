import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react"



interface User{
    name:string,
    id:string,
    token:string,
}

interface Authcontext{
    user:User|null,
    setUser:React.Dispatch<React.SetStateAction<User|null>>,
    isAuthenticated:boolean,
    logOut:VoidFunction,
    isLoading:boolean
}

//creating context
const AuthContext= createContext<Authcontext|undefined>(undefined);
//creating provider
export const AuthProvider:React.FC<{children:React.ReactNode}>= ({children})=>{
    const [user,setUser]=useState<User|null>(null)
    const isAuthenticated=!!user
    const [isLoading,setIsLoading]=useState<boolean>(true);
    useEffect(()=>{
        const load=async ()=>{
            try {
                const data = await AsyncStorage.getItem("ChatUserData")
                if(data) {
                    const userData=JSON.parse(data);
                    setUser(userData);
                } 
            } catch (error) {
                
            }finally{
                setIsLoading(false);
            }
        } 
        load();
    },[])

    const logOut=async ()=>{
        setUser(null);
        await AsyncStorage.removeItem("ChatUserData");
    }

    return(
        <AuthContext.Provider value={{user,setUser,isAuthenticated,logOut,isLoading}}>
            {children}
        </AuthContext.Provider> 
    )    
}
//create custom hook
export const useAuth=()=>{
    const context = useContext(AuthContext);
    if(context) return context;
    return null;
}